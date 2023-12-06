import { AutocompleteInteraction, ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandStringOption } from "discord.js";
import { Guardsman } from "index";
import axios, { AxiosResponse } from "axios";

export default class TestCommand implements ICommand 
{
    name: Lowercase<string> = "searchuser";
    description: string = "Allows guild moderators to search for a user's Guardsman data";
    guardsman: Guardsman;
    defaultMemberPermissions = PermissionFlagsBits.ModerateMembers

    options = [
        new SlashCommandStringOption()
            .setName("query")
            .setDescription("The field to search for (Roblox ID, Discord ID)")
            .setRequired(true)
            .setAutocomplete(true)
    ]

    constructor(guardsman: Guardsman) 
    {
        this.guardsman = guardsman;
    }

    async execute(interaction: ChatInputCommandInteraction<"cached">): Promise<void>
    {
        await interaction.deferReply();

        const query = interaction.options.getString("query", true);
        const userData: AxiosResponse<IUser> = await axios.get(`${this.guardsman.environment.GUARDSMAN_API_URL}/api/discord/user/${query}`, {
            headers: {
                "Authorization": this.guardsman.environment.GUARDSMAN_API_TOKEN
            }
        });

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(userData.data.username)
                    .setColor(Colors.Green)
                    .setFooter({ text: "Guardsman Database" })
                    .setTimestamp()
                    .addFields(
                        {
                            name: "Guardsman ID",
                            value: userData.data.id?.toString() || "Unknown",
                            inline: true
                        },

                        {
                            name: "Username",
                            value: userData.data.username,
                            inline: true
                        },

                        {
                            name: "ROBLOX ID",
                            value: userData.data.roblox_id,
                            inline: true
                        },

                        {
                            name: "Discord ID",
                            value: userData.data.discord_id,
                            inline: true
                        },

                        {
                            name: "Roles",
                            value: JSON.parse(userData.data.roles).join(", "),
                            inline: true
                        },

                        {
                            name: "Verified At",
                            value: userData.data.created_at?.toString() || "Unknown",
                            inline: true
                        }
                    )
            ]
        })
    }

    async autocomplete(interaction: AutocompleteInteraction<"cached">): Promise<void> {
        const query = interaction.options.getString("query", true);
        if (query == "") return;
        const searchData = await axios.get(`${this.guardsman.environment.GUARDSMAN_API_URL}/api/discord/search/${query}`, {
            headers: {
                "Authorization": this.guardsman.environment.GUARDSMAN_API_TOKEN
            }
        });

        interaction.respond(searchData.data);
    }
}