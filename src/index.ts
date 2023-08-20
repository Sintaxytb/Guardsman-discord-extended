import knex, { Knex } from "knex";
import Bot from "./bot/index.js";
import logger from "./util/log.js";
import { config } from "dotenv";
import Noblox from "noblox.js";
import API from "./api/index.js";

export enum GuardsmanState 
{
    OFFLINE,
    STARTING,
    ONLINE,
    STOPPING,
}

class GuardsmanObject 
{
    state: GuardsmanState = GuardsmanState.OFFLINE
    log;
    debug = process.argv.includes("--debug")
    environment = config().parsed || {};
    database: Knex;
    roblox: typeof Noblox;

    api: API;
    bot: Bot;
    
    constructor()
    {
        this.log = new logger("RaidManager", this);

        this.log.info("Initializing Guardsman...");
        this.state = GuardsmanState.STARTING;

        this.log.debug("Connecting to database...")
        this.database = knex({
            client: this.environment.DB_CONNECTION,
            connection: {
                host: this.environment.DB_HOST,
                port: parseInt(this.environment.DB_PORT),
                database: this.environment.DB_DATABASE,
                user: this.environment.DB_USERNAME,
                password: this.environment.DB_PASSWORD,

                pool: {
                    min: 1,
                    max: 10,
                },
            },
        })

        this.log.debug("Connecting to ROBLOX API...")
        this.roblox = Noblox;
        // this.roblox.setCookie(this.environment.ROBLOX_COOKIE);

        this.log.debug("Running database migrations...");
        this.database.migrate.latest();

        this.log.info("Initializing API...");
        this.api = new API(this);

        this.log.info("Initializing discord bot...")
        this.bot = new Bot(this);
    }
}

const Guardsman = new GuardsmanObject();

export default Guardsman;
export type Guardsman = typeof Guardsman;