import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";
import { Guardsman } from "index";

export default class PauseCommand implements ICommand 
{
    name: Lowercase<string> = "np";
    description: string = "Shows the current song.";
    guardsman: Guardsman;

    constructor(guardsman: Guardsman) 
    {
        this.guardsman = guardsman;
    }

    async execute(interaction: ChatInputCommandInteraction<"cached">): Promise<void>
    {
        await interaction.deferReply();

        if (!interaction.member.voice.channel) 
        {
            await interaction.editReply({
                content: "You must connect to a voice channel before running music commands!"
            });

            return;
        }

        if (!interaction.channel) return;

        const queue = this.guardsman.bot.musicController.queues.get(interaction.guild);
        if (!queue || !queue.currentTrack) 
        {
            await interaction.editReply({
                content: "The queue is empty!"
            });

            return;
        }

        const currentTrack = queue.currentTrack;

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Guardsman Music")
                    .setDescription(`Current Song: ${currentTrack.title} - ${currentTrack.author} \n • Requested By: ${currentTrack.requestedBy?.username || "Unknown"} \n • Author: ${currentTrack.author} \n • URL: ${currentTrack.url} \n • Length: ${currentTrack.duration}`)
                    .setColor(Colors.Blurple)
                    .setThumbnail(currentTrack.thumbnail)
                    .setFooter({ text: "Guardsman Discord" })
                    .setTimestamp()
            ]
        });
    }
}