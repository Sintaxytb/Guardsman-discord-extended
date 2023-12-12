import { Colors, EmbedBuilder, VoiceState } from "discord.js";
import { Guardsman } from "index";

export default async (guardsman: Guardsman, oldState: VoiceState, newState: VoiceState) =>
{
    // check if user who left had voted to skip the current song;
    if (!oldState.member || !newState.channel) return;

    const voteData = guardsman.bot.skipVotes[oldState.guild.id];
    if (!voteData || oldState.channelId != voteData.channelId) return;

    const memberIndex = voteData.voted.indexOf(oldState.member.id)
    if (memberIndex)
    {
        if (newState.channel.members.size == 2)
        {
            delete guardsman.bot.skipVotes[oldState.guild.id];
            
            await newState.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Guardsman Music")
                        .setDescription(`Only one user is left in the channel. Skipvotes have been reset.`)
                        .setColor(Colors.Blurple)
                        .setFooter({ text: "Guardsman Discord" })
                        .setTimestamp()
                ]
            })
        }
         else
        {
            voteData.needed = Math.floor(newState.channel.members.size * 0.75)
            voteData.voted.splice(memberIndex, 1);
    
            await newState.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Guardsman Music")
                        .setDescription(`A user who voted to skip the current song left the channel. New votes: (${voteData.voted.length}/${voteData.needed})`)
                        .setColor(Colors.Blurple)
                        .setFooter({ text: "Guardsman Discord" })
                        .setTimestamp()
                ]
            })
        }
    }
}