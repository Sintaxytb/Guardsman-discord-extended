declare type IScheduleEvent =
{
    host: string,
    name: string,
    type: "raid" | "training" | "tryout" | "eval" | "rally",
    length: number,
    date: number,
    notes: string
}

declare type IScheduledEvent =
{
    id: number
} & IScheduleEvent

declare type GuardsmanPermissionNode = 
    "moderate:moderate"
  | "moderate:search"
  | "manage:manage"
  | "manage:servers"
  | "manage:exploit-logs"
  | "development:development"
  | "development:source-control"
  | "development:error-tracking"
  | "development:remote-execute"
  | "administrate:administrate"
  | "administrate:manage-panel"
  | "administrate:make-user"
  | "administrate:manage-group"
  | "game:canBan"
  | "game:canExecuteCC"
  | "game:canGiveEffects"
  | "game:canGiveTools"
  | "game:canKick"
  | "game:canLockServer"
  | "game:canUnban"
  
declare interface IAPIPunishmentData {
    success: boolean
    id: string
}