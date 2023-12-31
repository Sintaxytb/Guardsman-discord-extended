import { QueryType } from "discord-player";
import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandAttachmentOption, SlashCommandStringOption } from "discord.js";
import { Guardsman } from "index";

export default class PlayCommand implements ICommand 
{
    name: Lowercase<string> = "play";
    description: string = "Adds provided song to the queue.";
    guardsman: Guardsman;

    options = [
        new SlashCommandStringOption()
            .setName("url")
            .setDescription("The URL or query of the song")
            .setRequired(false),
        
        new SlashCommandAttachmentOption()
            .setName("attachment")
            .setDescription("The song file top play")
            .setRequired(false)
    ]

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

        const urlQuery = await interaction.options.getString("url");
        const attachment = await interaction.options.getAttachment("attachment");

        if (!urlQuery && !attachment) {
            await interaction.editReply({
                content: "You must provide a URL or attachment to play!"
            });

            return;
        }

        const queue = await this.guardsman.bot.musicController.queues.create(interaction.guild);
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);

        if (attachment) {
            console.log(attachment.url);

            const { track } = await queue.play(attachment.url, {
                requestedBy: interaction.user
            });
    
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Guardsman Music")
                        .setDescription(`Successfully added \`${track.title} - ${track.author}\` to the queue!`)
                        .setColor(Colors.Blurple)
                        .setThumbnail(track.thumbnail)
                        .setFooter({ text: "Guardsman Discord" })
                        .setTimestamp()
                ]
            });
        }

        if (urlQuery) {
            const results = await this.guardsman.bot.musicController.search(urlQuery, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });
    
            if (results.tracks.length === 0 && !results.playlist) {
                await interaction.editReply("No tracks could be found. Check the query and try again.");
                return;
            }
    
            const track = results.tracks[0];
            const playlist = results.playlist;
            
            if (playlist) {
                for (const pTrack of playlist.tracks) {
                    await queue.addTrack(pTrack);
                }
    
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Guardsman Music")
                            .setDescription(`Successfully added ${playlist.tracks.length} tracks to the queue!`)
                            .setColor(Colors.Blurple)
                            .setThumbnail(track.thumbnail)
                            .setFooter({ text: "Guardsman Discord" })
                            .setTimestamp()
                    ]
                });
            } else {
                await queue.addTrack(track);
    
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Guardsman Music")
                            .setDescription(`Successfully added \`${track.title} - ${track.author}\` to the queue!`)
                            .setColor(Colors.Blurple)
                            .setThumbnail(track.thumbnail)
                            .setFooter({ text: "Guardsman Discord" })
                            .setTimestamp()
                    ]
                });
            }
        }

        const firstTrack = queue.tracks.at(0);
        if (!queue.isPlaying() && firstTrack) await queue.play(firstTrack, { nodeOptions: { metadata: interaction } });
    }
}