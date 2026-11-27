export interface AuthUser {
  id: string;
  username: string;
  name: string;
  syncCode: string;
}

export interface SyncDataPayload {
  slots: any[];
  subjects: any[];
  tasks: any[];
  profile: any;
}
