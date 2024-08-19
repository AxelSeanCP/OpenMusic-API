const mapAlbumToModel = ({ album_id, name, year }) => ({
  id: album_id,
  name,
  year,
});

const mapSongsToModel = ({ song_id, title, performer }) => ({
  id: song_id,
  title,
  performer,
});

const mapSongToModel = ({
  song_id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id: song_id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapPlaylistsToModel = ({ playlist_id, name, username }) => ({
  id: playlist_id,
  name,
  username,
});

module.exports = {
  mapAlbumToModel,
  mapSongToModel,
  mapSongsToModel,
  mapPlaylistsToModel,
};
