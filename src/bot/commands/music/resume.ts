import { QueryType, Track } from "discord-player";
import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandStringOption } from "discord.js";
import { Guardsman } from "index";

export default class PauseCommand implements ICommand 
{
    name: Lowercase<string> = "resume";
    description: string = "Resumes the current song.";
    guardsman: Guardsman;

    constructor(guardsman: Guardsman) 
    {
        this.guardsman = guardsman;
    }

    async execute(interaction: ChatInputCommandInteraction<"cached">): Promise<void>
    {
        await interaction.deferReply();

        if (!interaction.member.voice.channel) {
            await interaction.editReply({
                content: "not in channel"
            });

            return;
        }

        if (!interaction.channel) return;

        const queue = this.guardsman.bot.musicController.queues.get(interaction.guild);
        if (!queue || !queue.currentTrack) {
            await interaction.editReply({
                content: "no queue"
            });

            return;
        }

        if (!queue.node.isPaused()) {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Guardsman Music")
                        .setDescription(`The queue is not paused!`)
                        .setColor(Colors.Blurple)
                        .setFooter({ text: "Guardsman Discord" })
                        .setTimestamp()
                ]
            });

            return;
        }

        await queue.node.setPaused(false);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Guardsman Music")
                    .setDescription(`Successfully ${queue.node.isPaused() && "paused" || "unpaused"} the current song!`)
                    .setColor(Colors.Blurple)
                    .setFooter({ text: "Guardsman Discord" })
                    .setTimestamp()
            ]
        });
    }
}