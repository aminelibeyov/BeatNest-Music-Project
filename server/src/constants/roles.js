const ROLES = {
  USER: 'user',
  ARTIST: 'artist',
  ADMIN: 'admin'
};

const ROLE_PERMISSIONS = {
  user: ['view_songs', 'view_profile', 'create_playlist'],
  artist: ['upload_song', 'view_songs', 'view_profile', 'create_playlist', 'edit_own_songs'],
  admin: ['manage_users', 'manage_songs', 'manage_categories', 'view_analytics', 'manage_all']
};

module.exports = {
  ROLES,
  ROLE_PERMISSIONS
};
