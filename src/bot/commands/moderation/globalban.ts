import { ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandStringOption } from "discord.js";
import { Guardsman } from "index";

export default class GlobalBanCommand implements ICommand 
{
    name: Lowercase<string> = "globalban";
    description: string = "Allows Guardsman moderators to global ban a user from ALL Guardsman-controlled servers.";
    guardsman: Guardsman;

    options = [
        new SlashCommandStringOption()
            .setName("id")
            .setDescription("The Guardsman ID of the user to ban (To find, run /searchuser)")
            .setRequired(true)
    ]

    constructor(guardsman: Guardsman) 
    {
        this.guardsman = guardsman;
    }

    async execute(interaction: ChatInputCommandInteraction<"cached">): Promise<void>
    {
        await interaction.deferReply();

        const guardsmanId = interaction.options.getString("id", true);
        const canGlobalBan = await this.guardsman.bot.checkGuardsmanPermissionNode(interaction.user, "moderate:moderate");
        
        console.log("here");

        if (!canGlobalBan) {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Guardsman API")
                        .setDescription("You do not have permission to `moderate:moderate`")
                        .setColor(Colors.Red)
                        .setFooter({ text: "Guardsman API" })
                        .setTimestamp()
                ]
            });

            return;
        }

        await interaction.editReply("WIP Command, please check back soon!");
    }
}