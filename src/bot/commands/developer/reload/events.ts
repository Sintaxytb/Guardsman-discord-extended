import { Guardsman } from "index";
import {ChatInputCommandInteraction, Colors, EmbedBuilder} from "discord.js";
import { config as parseEnv } from "dotenv";

export default class ReloadEventsSubcommand implements ICommand
{
    name: Lowercase<string> = "events";
    description = "(DEVELOPER ONLY) Reloads all bot events."
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
            await this.guardsman.bot.events.load();

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Events reloaded")
                        .setDescription(`All events have successfully been reloaded.`)
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
                        .setDescription(`Events failed to reload. ${error}`)
                        .setColor(Colors.Red),
                ]
            })
        }
    }
}