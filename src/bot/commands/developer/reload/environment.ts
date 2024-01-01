import { Guardsman } from "index";
import {ChatInputCommandInteraction, Colors, EmbedBuilder} from "discord.js";
import { config as parseEnv } from "dotenv";

export default class ReloadEnvironmentSubcommand implements ICommand
{
    name: Lowercase<string> = "environment";
    description = "(DEVELOPER ONLY) Reloads the bot environment file."
    developer = true;

    guardsman: Guardsman;

    constructor(guardsman: Guardsman)
    {
        this.guardsman = guardsman;
    }

    async execute(interaction: ChatInputCommandInteraction<"cached">): Promise<void>
    {
        const environment = parseEnv().parsed || {};
        await interaction.deferReply();

        try
        {
            this.guardsman.environment = environment;

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Environment reloaded")
                        .setDescription(`Environment has successfully been reloaded.`)
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
                        .setDescription(`Environment failed to reload. ${error}`)
                        .setColor(Colors.Red),
                ]
            })
        }
    }
}