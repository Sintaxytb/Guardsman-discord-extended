import { Guardsman } from "index";
import {
    ApplicationCommandOptionBase,
    ChatInputCommandInteraction, Colors, EmbedBuilder,
    SlashCommandNumberOption,
    SlashCommandRoleOption, PermissionFlagsBits
} from "discord.js";

export default class UnbindBadgeSubcommand implements ICommand {
    name: Lowercase<string> = "badge";
    description: string = "Allows guild administrators to unbind ROBLOX badge data from the guild.";
    guardsman: Guardsman;
    defaultMemberPermissions = PermissionFlagsBits.ManageRoles;
    options: ApplicationCommandOptionBase[] = [
        new SlashCommandRoleOption()
            .setName("role")
            .setDescription("The role to unbind from.")
            .setRequired(true),
        new SlashCommandNumberOption()
            .setName("badge")
            .setDescription("The ID of the badge to unbind from.")
            .setRequired(true),
    ];

    constructor(guardsman: Guardsman) {
        this.guardsman = guardsman;
    }

    async execute(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        const options = interaction.options;
        const guild = interaction.guild;

        const guildRole = options.getRole("role", true);
        const badgeId = options.getNumber("badge", true);

        // validate role settings
        const badgeRoleBind: RoleData<RoleDataBadgeBind> = {
            type: "badge",
            badgeId: badgeId
        }

        const existingRole = await this.guardsman.database<IRoleBind>("verification_binds")
            .where({
                guild_id: guild.id,
                role_id: guildRole.id,
                role_data: JSON.stringify(badgeRoleBind)
            })
            .first();

        if (!existingRole) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Guardsman Database")
                        .setDescription(`A badge role bind for <@&${guildRole.id}> with those properties does not exist.`)
                        .setColor(Colors.Red)
                        .setTimestamp()
                        .setFooter({ text: "Guardsman Database" })
                ]
            });

            return;
        }

        await this.guardsman.database<IRoleBind>("verification_binds")
            .delete()
            .where({
                id: existingRole.id,
                guild_id: existingRole.guild_id,
                role_id: existingRole.role_id,
                role_data: existingRole.role_data,
            })

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Guardsman Database`)
                    .setDescription(`Successfully removed badge bind for <@&${guildRole.id}> for badge ${badgeId}.`)
                    .setColor(Colors.Green)
                    .setTimestamp()
                    .setFooter({ text: "Guardsman Database" })
            ]
        })
    }
}