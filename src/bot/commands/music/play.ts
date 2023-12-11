import { QueryType } from "discord-player";
import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandStringOption } from "discord.js";
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
            .setRequired(true)
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

        const query = await interaction.options.getString("url", true);
        const queue = await this.guardsman.bot.musicController.queues.create(interaction.guild);
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);

        const results = await this.guardsman.bot.musicController.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO_SEARCH
        });

        if (results.tracks.length === 0) {
            await interaction.editReply("No tracks could be found. Check the query and try again.");
            return;
        }

        const track = results.tracks[0];
        await queue.addTrack(track);

        const firstTrack = queue.tracks.at(0);
        if (!queue.isPlaying() && firstTrack) await queue.play(firstTrack);

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