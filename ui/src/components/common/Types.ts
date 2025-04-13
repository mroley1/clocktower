// More basic form of Script that does not contain role data(as there are cases where that info is excessive)
export interface Script {
    id: number;
    name: string;
    author: string;
    date_created: string;
    version?: number;
}

// Role interface to match the API response
export interface Role {
    id: number;
    role_name: string;
    description: string;
    alignment_name: string;
    team_name: string;
}