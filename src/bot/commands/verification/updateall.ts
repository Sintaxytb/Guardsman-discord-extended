import {
    ChatInputCommandInteraction,
    Colors,
    EmbedBuilder,
    PermissionFlagsBits
} from "discord.js";
import { Guardsman } from "index";
import { updateUser } from "../../util/user.js"

export default class UpdateAllCommand implements ICommand {
    name: Lowercase<string> = "updateall";
    description: string = "Allows guild administrators to update all members of a guild.";
    guardsman: Guardsman;
    defaultMemberPermissions = PermissionFlagsBits.Administrator;

    constructor(guardsman: Guardsman) {
        this.guardsman = guardsman;
    }

    async execute(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
        const guild = interaction.guild;

        const guildMembers = await guild.members.list({ limit: 1000 })

        const interact = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Orange)
                    .setTitle("Guardsman Update All")
                    .setDescription(`Updating all guild members. This may take some time.`)
                    .setTimestamp()
                    .setFooter({ text: "Guardsman Verification" })
            ]
        })

        for (const guildMember of Array.from(guildMembers.values())) {

            const existingUserData = await this.guardsman.database<IUser>("users")
                .where("discord_id", guildMember.id)
                .first();

            if (!existingUserData) continue;

            let userReturn = await updateUser(this.guardsman, guild, guildMember, existingUserData);

            if (userReturn.errors.length > 0) {
                await interaction.channel?.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setTitle("Guardsman User Update")
                            .setDescription(`Update for <@${guildMember.id}> ran into a slight problem that may or may not impact the user. Errors: ${userReturn.errors.join("\n")}`)
                            .setTimestamp()
                            .setFooter({ text: "Guardsman Verification" })
                    ]
                })
            }

            const guildMembersArray = Array.from(guildMembers.values());

            await interact.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Orange)
                        .setTitle("Guardsman Update All")
                        .setDescription(`Updating all guild members. This may take some time.\nProgress: ${guildMembersArray.indexOf(guildMember) + 1}/${guildMembersArray.length} (${Math.round(((guildMembersArray.indexOf(guildMember) + 1) / guildMembersArray.length) * 100)}%)`)
                        .setTimestamp()
                        .setFooter({ text: "Guardsman Verification" })
                ]
            })

            await new Promise((resolve) => {
                setTimeout(resolve, (Math.floor(Math.random() * 5) * 1000) + 3_000)
            })
        }

        await interact.edit({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle("Guardsman Update All")
                    .setDescription(`Update all completed.`)
                    .setTimestamp()
                    .setFooter({ text: "Guardsman Verification" })
            ]
        })
    }
}