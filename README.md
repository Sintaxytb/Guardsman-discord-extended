<div align="center">
    <img style="width: 100px" src="image/README/1702528067173.png" />
    <h3 style="text-align: center">Guardsman</h3>
</div

---

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)
[![img](https://img.shields.io/badge/We%20support-BlueHats-blue.svg)](https://bluehats.global)


---

> [!WARNING]
> ### Deprecation Notice & Repository Status
> 
> With the official release of **Guardsman V2**, this legacy project has been **deprecated**, and active development has **ceased**. 
> 
> This repository is a fork of the original codebase, created following the privatization of the primary upstream repository.
> 
> ---
> 
> #### Intellectual Property
> All contents within this repository are the property of **Bunker Bravo LLC**.
> 
> #### Important Notes & Disclaimers
> * **Not a Replacement:** This repository does not serve as a functional replacement for Guardsman V2.
> * **Maintenance:** The codebase is unmaintained and contains deprecated components.
> * **Source Code Availability:** Neither the frontend nor backend components of Guardsman V2 will be made open-source. As a result, this repository will not receive further feature updates or alignment with V2.
> 
> ---
> 

# Guardsman Discord Extended
<p>Guardsman is Bunker Bravo's moderation and management suite. This component (guardsman-discord-extended) is responsible for providing a Discord management interface for partnered guilds and global Bunker Bravo moderators. </p>

# Links


# Installation
To install Guardsman Discord on your system, follow these steps:

**NOTE: Guardsman Discord Extended has only been tested on linux and win32.**

**NOTE: Guardsman Discord Extended REQUIRES a working Guardsman Web installation. Please follow the installation instructions for [Guardsman Web](https://github.com/Sintaxytb/Guardsman-Web-Origin-Repo).**

- Clone the [Guardsman Discord Extended](https://git.bunkerbravointeractive.com/bunker-bravo-interactive/guardsman-discord-extended) repository. (ex: `git clone https://github.com/Sintaxytb/Guardsman-discord-extended/`

- Install NPM dependencies with your package manager of choice (`npm install`, `pnpm install`, `yarn install`)

- Copy `.env.example` to `.env` (`cp .env.example .env`)

- Database migrations can be found in the [Guardsman Web](https://github.com/Sintaxytb/Guardsman-Web-Origin-Repo) repository. You **MUST** have a working Guardsman Web installation to run Guardsman Discord Extended.

# Configuration
The following configuration values **MUST** be set:
- `DISCORD_BOT_TOKEN`
- `DISCORD_BOT_CLIENT_ID`
- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`

Default values that are already configured are acceptable for use.

For verification to work, the following values must be set:
- `ROBLOX_CLIENT_ID`
- `ROBLOX_CLIENT_TOKEN`
- `APP_URL`
- `VERIFICATION_COMPLETE_URI`
- `GUARDSMAN_API_URL`
- `GUARDSMAN_API_TOKEN`
- `API_PORT`

# Running the bot
To deploy the bot to production, run `npm run start`. This will generate the minified files and run the bot.

A good way to keep Guardsman up is to use a process manager like PM2. To install run the following commands:

- `npm install -g pm2` (**linux users**, you may have to use sudo depending on how your node is installed)

- `pm2 start "node build/src/index.js" --name "GuardsmanDiscord"`

- `pm2 startup` (to start pm2 processes on boot)

- `pm2 save` (to save the current process list which will let Guardsman start on boot)

If you need to stop Guardsman, you can use `pm2 stop GuardsmanDiscord`. To restart, use `pm2 reload GuardsmanDiscord`. Make sure to build(`npm run build`) before restarting if you have made changes.

To run the bot in a development environment, run `npm run dev`.
