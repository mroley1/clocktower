export interface Script {
    id: number;
    name: string;
    author: string;
    date_created: string;
    version?: number;
}

export interface Role {
    id: number;
    role_name: string;
    description: string;
    alignment_name: string;
    team_name: string;
}