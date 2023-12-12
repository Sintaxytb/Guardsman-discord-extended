import { QueryType, Track } from "discord-player";
import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandStringOption } from "discord.js";
import { Guardsman } from "index";

const skipVotes : { [guildId: string]: { track: Track, channelId: string, voted: string[], needed: number } } = {};

export default class SkipCommand implements ICommand 
{
    name: Lowercase<string> = "skip";
    description: string = "Votes to skip the current song.";
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
                content: "You must connect to a voice channel before running music commands!"
            });

            return;
        }

        if (!interaction.channel) return;

        const queue = this.guardsman.bot.musicController.queues.get(interaction.guild);
        if (!queue || !queue.currentTrack) {
            await interaction.editReply({
                content: "The queue is empty!"
            });

            return;
        }

        if (interaction.member.voice.channel.members.size == 2) {
            await queue.removeTrack(queue.currentTrack);
            await queue.node.skip();

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Guardsman Music")
                        .setDescription(`Successfully skipped the current song!`)
                        .setColor(Colors.Blurple)
                        .setFooter({ text: "Guardsman Discord" })
                        .setTimestamp()
                ]
            });

            return;
        }

        if (!skipVotes[interaction.guild.id] || skipVotes[interaction.guild.id].channelId != interaction.channel.id) {
            skipVotes[interaction.guild.id] = {
                channelId: interaction.channel.id,
                track: queue.currentTrack,
                voted: [interaction.member.id],
                needed: Math.floor(interaction.member.voice.channel.members.size * 0.75),
            }

            const voteData = skipVotes[interaction.guild.id];

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Guardsman Music")
                        .setDescription(`Voted to skip the current song! (${voteData.voted.length}/${voteData.needed})`)
                        .setColor(Colors.Blurple)
                        .setFooter({ text: "Guardsman Discord" })
                        .setTimestamp()
                ]
            });
        } else {
            const voteData = skipVotes[interaction.guild.id];
            if (voteData.voted.includes(interaction.member.id)) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Guardsman Music")
                            .setDescription(`You have already voted to skip the current song! (${voteData.voted.length}/${voteData.needed})`)
                            .setColor(Colors.Blurple)
                            .setFooter({ text: "Guardsman Discord" })
                            .setTimestamp()
                    ]
                });

                return;
            }

            voteData.needed = Math.floor(interaction.member.voice.channel.members.size * 0.75)
            voteData.voted.push(interaction.member.id);
            
            if (voteData.voted.length >= voteData.needed) 
            {
                await queue.removeTrack(queue.currentTrack);
                await queue.node.skip();

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Guardsman Music")
                            .setDescription(`Successfully skipped the current song!`)
                            .setColor(Colors.Blurple)
                            .setFooter({ text: "Guardsman Discord" })
                            .setTimestamp()
                    ]
                });
            }
            else
            {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Guardsman Music")
                            .setDescription(`Voted to skip the current song! (${voteData.voted.length}/${voteData.needed})`)
                            .setColor(Colors.Blurple)
                            .setFooter({ text: "Guardsman Discord" })
                            .setTimestamp()
                    ]
                });
            }
        }
    }
}