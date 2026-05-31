export interface CloudAsset {
  id: string;
  tenant_id: string;
  url: string;
  purpose: 'avatars' | 'logos' | 'audio' | 'documents' | 'backups';
  bytes_size: number;
}
