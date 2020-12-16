export interface IBotProfile {
    id: string;
    deleted: boolean;
    name: string;
    updated: number;
    app_id: string;
    icons: Array<string>;
    team_id: string
}
