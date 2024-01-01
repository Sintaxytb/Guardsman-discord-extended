import { Guardsman } from "index";
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";

export default class ReloadCommandsSubcommand implements ICommand
{
    name: Lowercase<string> = "commands";
    description = "(DEVELOPER ONLY) Reloads all bot commands."
    developer = true;

    guardsman: Guardsman;

    constructor(guardsman: Guardsman)
    {
        this.guardsman = guardsman;
    }

    async execute(interaction: ChatInputCommandInteraction<"cached">): Promise<void>
    {
        await interaction.deferReply();

        try
        {
            await this.guardsman.bot.commands.push();

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Commands reloaded")
                        .setDescription(`All commands have successfully been reloaded.`)
                        .setColor(Colors.Green),
                ],
            });
        }
        catch (error)
        {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Component Reload failed")
                        .setDescription(`Commands failed to reload. ${error}`)
                        .setColor(Colors.Red),
                ]
            })
        }
    }
}