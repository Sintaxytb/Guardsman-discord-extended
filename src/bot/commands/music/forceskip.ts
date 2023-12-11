import { QueryType } from "discord-player";
import { ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandStringOption } from "discord.js";
import { Guardsman } from "index";

const skipVotes : { [guildId: string]: { channelId: string, votes: number, needed: number } } = {};

export default class ForceSkipCommand implements ICommand 
{
    name: Lowercase<string> = "forceskip";
    description: string = "Force skips the current song.";
    guardsman: Guardsman;
    defaultMemberPermissions?: string | number | bigint | null | undefined = PermissionFlagsBits.ModerateMembers;

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

        const queue = this.guardsman.bot.musicController.queues.get(interaction.guild);
        if (!queue || !queue.currentTrack) {
            await interaction.editReply({
                content: "no queue"
            });

            return;
        }
        
        await queue.removeTrack(queue.currentTrack);
        await queue.node.skip();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Guardsman Music")
                    .setDescription(`Successfully force skipped the song!`)
                    .setColor(Colors.Blurple)
                    .setFooter({ text: "Guardsman Discord" })
                    .setTimestamp()
            ]
        });
    }
}