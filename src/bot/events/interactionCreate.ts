import {Colors, EmbedBuilder, Interaction, GuildScheduledEventEntityType, PermissionFlagsBits} from "discord.js";
import { Guardsman } from "index";

function firstToUpper(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default async (guardsman: Guardsman, interaction: Interaction<"cached">) =>
{
    if (interaction.isChatInputCommand())
    {
        const sentCommand = interaction.commandName;
        const options = interaction.options;
        let command: ICommand | undefined;

        guardsman.bot.commands.list.find(category =>
            {
                command = category.find(com => com.name == sentCommand)
                return command;
            })

        if (!command)
        {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Command Execution Error")
                        .setDescription(`No command was found matching name \`${sentCommand}\`.`)
                        .setColor(Colors.Red)
                ]
            })
        }

        const subCommand = options.getSubcommand(false);
        if (subCommand)
        {
            command = command.subcommands?.find(subCom => subCom.name == subCommand);
        }

        if (!command)
        {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Command Execution Error")
                        .setDescription(`No subcommand was found matching name \`${sentCommand}\`.`)
                        .setColor(Colors.Red)
                ]
            })
        }

        if (command.developer && interaction.member.id != "250805980491808768")
        {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Command Execution Error")
                        .setDescription(`You do not have permission to execute this command.`)
                        .setColor(Colors.Red)
                ]
            })
        }

        if (typeof command.defaultMemberPermissions == "bigint" && !interaction.member.permissions.has(command.defaultMemberPermissions))
        {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Command Execution Error")
                        .setDescription(`You do not have permission to execute this command.`)
                        .setColor(Colors.Red)
                ]
            })
        }

        try
        {
            await command.execute(interaction);
        }
        catch (error)
        {
            const replied = interaction.replied;
            const replyData = {
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Command Execution Error")
                        .setDescription(`${error}`)
                        .setColor(Colors.Red)
                ]
            }

            if (replied)
            {
                return interaction.editReply(replyData)
            }
            else
            {
                return interaction.reply(replyData);
            }
        }
    }
}