import { useEffect, useRef, useState } from 'react'
import './App.css'
import { login, register } from './api/auth.js'
import { searchSongs } from './api/music.js'

const featuredPlaylists = [
  {
    id: 1,
    name: 'City Afterglow Exchange',
    description: 'Community-picked late-night cuts that travel cleanly between platform catalogs.',
    curator: 'Maya R.',
    collaborators: 18,
    updated: '2 hours ago',
    mood: 'Neon indie',
    sources: ['Spotify', 'YouTube'],
  },
  {
    id: 2,
    name: 'Open Tabs, Open Decks',
    description: 'Focus-heavy electronic tracks for shared work sessions and playlist swaps.',
    curator: 'Devon + Friends',
    collaborators: 27,
    updated: 'Today',
    mood: 'Study pulse',
    sources: ['Spotify', 'SoundCloud'],
  },
  {
    id: 3,
    name: 'Global Commute Signals',
    description: 'Daily handoff playlist stitched from train rides, buses, and early flights.',
    curator: 'Transit Club',
    collaborators: 41,
    updated: '5 hours ago',
    mood: 'Alt pop motion',
    sources: ['YouTube'],
  },
  {
    id: 4,
    name: 'Basement Session Archive',
    description: 'Shared live-session favorites surfaced from community uploads and rare edits.',
    curator: 'K. Hollow',
    collaborators: 12,
    updated: 'Yesterday',
    mood: 'Live cuts',
    sources: ['SoundCloud', 'YouTube'],
  },
]

const recentSharedPlaylists = [
  {
    id: 5,
    name: 'Sunday Reset Room',
    description: 'Soft resets, ambient hooks, and low-tempo discoveries from shared listening rooms.',
    curator: 'Alina T.',
    collaborators: 9,
    updated: '13 minutes ago',
    mood: 'Ambient reset',
    sources: ['Spotify'],
  },
  {
    id: 6,
    name: 'Friends of the Algorithm',
    description: 'A running experiment where each collaborator contributes one cross-platform wildcard.',
    curator: 'Jordan P.',
    collaborators: 22,
    updated: '31 minutes ago',
    mood: 'Discovery mix',
    sources: ['Spotify', 'YouTube', 'SoundCloud'],
  },
  {
    id: 7,
    name: 'Shared Vinyl Rip Stack',
    description: 'Recent restorations, unofficial uploads, and clean digital replacements in one place.',
    curator: 'Needle Drop Crew',
    collaborators: 16,
    updated: '48 minutes ago',
    mood: 'Warm archive',
    sources: ['YouTube', 'SoundCloud'],
  },
  {
    id: 8,
    name: 'Two Person Roadmap',
    description: 'A collaborative blend for pairs building long-form playlists together over time.',
    curator: 'Chris + Nia',
    collaborators: 2,
    updated: '1 hour ago',
    mood: 'Duo blend',
    sources: ['Spotify'],
  },
]

const defaultPersonalPlaylists = [
  {
    id: 1,
    name: 'Prototype Soundtrack',
    tracks: 24,
    summary: 'UI reviews, design sessions, and deep build sprints.',
    sources: ['Spotify'],
    updated: '2 hours ago',
  },
  {
    id: 2,
    name: 'Night Drive Pull',
    tracks: 17,
    summary: 'Low-glow synth and wide-open road selections.',
    sources: ['YouTube', 'SoundCloud'],
    updated: 'Yesterday',
  },
  {
    id: 3,
    name: 'Shared Queue Inbox',
    tracks: 31,
    summary: 'Collaborator submissions waiting for a final pass.',
    sources: ['Spotify', 'YouTube'],
    updated: '3 days ago',
  },
]

const friendActivity = [
  {
    id: 1,
    name: 'Leah Morgan',
    status: 'Updated Shared Vinyl Rip Stack',
    note: 'Added 4 tracks from a restored live session.',
  },
  {
    id: 2,
    name: 'Rico Alvarez',
    status: 'Invited you to Friends of the Algorithm',
    note: 'Your wildcard slot is still open.',
  },
  {
    id: 3,
    name: 'Nia Patel',
    status: 'Commented on Two Person Roadmap',
    note: 'Suggested a softer handoff for the closing run.',
  },
]

const trendingSongs = [
  {
    id: 1,
    title: 'Let It Happen',
    artist: 'Tame Impala',
    album: 'Currents',
    duration: '7:47',
    mood: 'Psychedelic Rock',
    source: 'YouTube',
    plays: '3.1M',
  },
  {
    id: 2,
    title: 'Climbing Up The Walls',
    artist: 'Radiohead',
    album: 'OK Computer',
    duration: '4:45',
    mood: 'Alternative Rock',
    source: 'Spotify',
    plays: '1.5M',
  },
  {
    id: 3,
    title: 'End of Summer',
    artist: 'Tame Impala',
    album: 'Currents',
    duration: '3:54',
    mood: 'Dream Pop',
    source: 'SoundCloud',
    plays: '1.3M',
  },
  {
    id: 4,
    title: 'The Bold Arrow Of Time',
    artist: 'Tame Impala',
    album: 'The Slow Rush',
    duration: '4:20',
    mood: 'Psychedelic EDM',
    source: 'Spotify',
    plays: '1.4M',
  },
  {
    id: 5,
    title: 'The Less I Know The Better',
    artist: 'Tame Impala',
    album: 'Currents',
    duration: '3:36',
    mood: 'Psychedelic Pop',
    source: 'Spotify',
    plays: '2.9M',
  },
  {
    id: 6,
    title: 'Elephant',
    artist: 'Tame Impala',
    album: 'Lonerism',
    duration: '3:31',
    mood: 'Psychedelic Rock',
    source: 'SoundCloud',
    plays: '1.8M',
  },
]

const platformOptions = ['Spotify', 'YouTube', 'SoundCloud']

const sourceMarks = {
  Spotify: 'SP',
  YouTube: 'YT',
  SoundCloud: 'SC',
}

const djSongs = [
  { id: 1, title: 'The Less I Know The Better', artist: 'Tame Impala' },
  { id: 2, title: 'Let It Happen', artist: 'Tame Impala' },
  { id: 3, title: 'Elephant', artist: 'Tame Impala' },
]

const djPlaylists = [
  { name: 'Late Night Code', mood: 'Chill Synth' },
  { name: 'Morning Commute', mood: 'Indie Pop' },
  { name: 'Focus Flow', mood: 'Lo-fi' },
]

const recommendationCatalog = [
  { title: 'Neon Tide', artist: 'Astra Vale', vibe: 'Dream Pop', tags: ['late', 'night', 'synth', 'code', 'chill', 'focus'] },
  { title: 'Metro Pulse', artist: 'The Junction', vibe: 'Indie Pop', tags: ['morning', 'commute', 'indie', 'pop', 'city'] },
  { title: 'Cloud Circuit', artist: 'Mono Harbor', vibe: 'Lo-fi', tags: ['focus', 'study', 'lofi', 'calm', 'flow'] },
  { title: 'Amber Static', artist: 'Paper Lanterns', vibe: 'Alt R&B', tags: ['after', 'slow', 'night', 'smooth'] },
  { title: 'Blue Arcade', artist: 'North Arcade', vibe: 'Synthwave', tags: ['drive', 'retro', 'night', 'electronic'] },
  { title: 'Window Seat', artist: 'Civic Bloom', vibe: 'Acoustic Indie', tags: ['rainy', 'calm', 'indie', 'soft'] },
]

function getRecommendations(query) {
  const cleaned = query.trim().toLowerCase()
  const words = cleaned.split(/\s+/).filter(Boolean)

  const playlistMatch = djPlaylists.find((p) => cleaned.includes(p.name.toLowerCase()) || cleaned.includes(p.mood.toLowerCase()))
  const songMatch = djSongs.find((s) => cleaned.includes(s.title.toLowerCase()) || cleaned.includes(s.artist.toLowerCase()))

  const scored = recommendationCatalog
    .map((track) => ({ ...track, score: words.reduce((t, w) => track.tags.some((tag) => tag.includes(w)) ? t + 1 : t, 0) }))
    .sort((a, b) => b.score - a.score)

  const suggestions = scored.filter((t) => t.score > 0).slice(0, 3)
  const fallback = scored.slice(0, 3)

  let scene = 'Midnight Cruise'
  if (words.some((w) => ['focus', 'study', 'calm', 'flow', 'lofi'].includes(w))) scene = 'Deep Focus Pulse'
  else if (words.some((w) => ['drive', 'night', 'retro', 'city'].includes(w))) scene = 'Neon Drive Lane'
  else if (words.some((w) => ['indie', 'morning', 'commute', 'acoustic'].includes(w))) scene = 'Sunrise Side B'

  let reason = 'I caught your vibe — here is a smooth next run.'
  let hostLine = 'CrossFade DJ on the decks. Blending your lane into a fresh set.'

  if (playlistMatch) {
    reason = `You pulled ${playlistMatch.name}, so I mixed around its ${playlistMatch.mood} texture.`
    hostLine = `CrossFade DJ live: spinning from ${playlistMatch.name} into a cleaner transition set.`
  } else if (songMatch) {
    reason = `You liked ${songMatch.title}, so this mini-set keeps the same emotional tempo.`
    hostLine = `CrossFade DJ live: using ${songMatch.title} as the anchor and widening the sound.`
  }

  return { reason, suggestions: suggestions.length > 0 ? suggestions : fallback, scene, hostLine }
}

const validPages = ['home', 'playlists', 'friends', 'login', 'register']

function normalizeRoute(value) {
  return value
    .toLowerCase()
    .replace(/^#/, '')
    .replace(/^\//, '')
    .replace(/\?.*$/, '')
    .replace(/\/.*/, '')
    .replace(/\/+$/, '')
    .trim()
}

function getPageFromLocation() {
  const fromHash = normalizeRoute(window.location.hash)
  if (validPages.includes(fromHash)) {
    return fromHash
  }

  const fromPath = normalizeRoute(window.location.pathname)
  if (validPages.includes(fromPath)) {
    return fromPath
  }

  return 'home'
}

function SourcePills({ sources }) {
  return (
    <div className="source-pill-row" aria-label="Playlist sources">
      {sources.map((source) => (
        <span key={source} className={`source-pill ${source.toLowerCase().replace(/\s+/g, '-')}`} title={source}>
          <span className="source-pill-mark" aria-hidden="true">
            {sourceMarks[source]}
          </span>
          <span>{source}</span>
        </span>
      ))}
    </div>
  )
}

function SongCard({ song, index, comments = [], onAddComment, onRemoveComment, onPlay, isPlaying }) {
  const [draftComment, setDraftComment] = useState('')

  const handleCardPlay = (event) => {
    if (event.target.closest('button, input, form, a')) {
      return
    }

    onPlay(song)
  }

  const handleCardKeyDown = (event) => {
    if (event.target.closest('button, input, form, a')) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onPlay(song)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = draftComment.trim()
    if (!trimmed) return
    onAddComment(song.id, trimmed)
    setDraftComment('')
  }

  return (
    <article
      className={`song-card ${isPlaying ? 'song-card--playing' : ''}`}
      onClick={handleCardPlay}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Play ${song.title} by ${song.artist}`}
    >
      <div className="song-card-rank" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
      <div className="song-card-art" aria-hidden="true">
        <span className="song-art-inner"></span>
      </div>
      <div className="song-card-info">
        <span className="song-card-title">{song.title}</span>
        <span className="song-card-artist">{song.artist}</span>
        <span className="song-card-album">{song.album}</span>
      </div>
      <div className="song-card-meta">
        <span className={`song-source-badge ${song.source.toLowerCase()}`}>
          {sourceMarks[song.source] || song.source.slice(0, 2).toUpperCase()}
        </span>
        <span className="song-mood-tag">{song.mood}</span>
      </div>
      <div className="song-card-right">
        <span className="song-plays">{song.plays}</span>
        <span className="song-duration">{song.duration}</span>
        <button
          type="button"
          className={`song-play-btn ${isPlaying ? 'is-playing' : ''}`}
          onClick={() => onPlay(song)}
          aria-label={`${isPlaying ? 'Pause' : 'Play'} ${song.title}`}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
      </div>

      <div className="song-meta-comments">
        <div className="song-comments-header">Comments</div>
        {comments.length > 0 ? (
          <ul className="song-comments-list">
            {comments.map((comment, i) => (
              <li key={`${song.id}-comment-${i}`} className="song-comment-item">
                <span>{comment}</span>
                <button
                  type="button"
                  className="song-comment-delete"
                  onClick={() => onRemoveComment(song.id, i)}
                  aria-label={`Delete comment ${i + 1} on ${song.title}`}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="song-no-comments">No comments yet. Be the first to add one.</p>
        )}

        <form className="song-comment-form" onSubmit={handleSubmit}>
          <input
            type="text"
            aria-label={`Comment on ${song.title}`}
            placeholder="Add a comment..."
            value={draftComment}
            onChange={(event) => setDraftComment(event.target.value)}
          />
          <button type="submit" className="song-comment-submit">Add</button>
        </form>
      </div>
    </article>
  )
}

function PlaylistCard({ playlist, emphasis }) {
  return (
    <article className={`playlist-hub-card ${emphasis}`}>
      <div className="playlist-hub-art" aria-hidden="true">
        <span className="art-ring art-ring-one"></span>
        <span className="art-ring art-ring-two"></span>
        <span className="art-core"></span>
      </div>
      <div className="playlist-hub-copy">
        <div className="playlist-kicker-row">
          <span className="playlist-kicker">{playlist.mood}</span>
          <span className="playlist-update">{playlist.updated}</span>
        </div>
        <h3>{playlist.name}</h3>
        <p>{playlist.description}</p>
      </div>
      <div className="playlist-hub-footer">
        <div className="playlist-meta-stack">
          <span>Curated by {playlist.curator}</span>
          <span>{playlist.collaborators} collaborators</span>
        </div>
        <SourcePills sources={playlist.sources} />
      </div>
    </article>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState(() => getPageFromLocation())
  const [searchQuery, setSearchQuery] = useState('late night collaborative playlists')
  const [activePlatforms, setActivePlatforms] = useState(['Spotify', 'YouTube'])
  const [myPlaylists, setMyPlaylists] = useState(defaultPersonalPlaylists)
  const [playlistPlatform, setPlaylistPlatform] = useState('All')
  const [playlistSort, setPlaylistSort] = useState('updated')
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistSource, setNewPlaylistSource] = useState('Spotify')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatResult, setChatResult] = useState(null)
  const [isThinking, setIsThinking] = useState(false)
  const [chatHint, setChatHint] = useState('')
  const [songSearchResults, setSongSearchResults] = useState([])
  const [songSearchError, setSongSearchError] = useState('')
  const [songSearchUnavailableSources, setSongSearchUnavailableSources] = useState([])
  const [isSongSearchLoading, setIsSongSearchLoading] = useState(false)
  const [songSearchQuery, setSongSearchQuery] = useState('')
  const [currentPlayingSongId, setCurrentPlayingSongId] = useState(null)
  const [activePlayer, setActivePlayer] = useState(null)
  const audioRef = useRef(null)

  const [songComments, setSongComments] = useState({
    1: ['Smooth drive anthem, this hits late night mode'],
    2: ['Great production layers, static texture is pure mood'],
  })

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState(null)
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerFirstName, setRegisterFirstName] = useState('')
  const [registerLastName, setRegisterLastName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')

  const addSongComment = (songId, comment) => {
    if (!comment || !comment.trim()) return
    const trimmed = comment.trim()
    setSongComments((prev) => ({
      ...prev,
      [songId]: [...(prev[songId] || []), trimmed],
    }))
  }

  const removeSongComment = (songId, index) => {
    setSongComments((prev) => {
      const current = prev[songId] || []
      if (index < 0 || index >= current.length) return prev
      const next = [...current.slice(0, index), ...current.slice(index + 1)]
      return {
        ...prev,
        [songId]: next,
      }
    })
  }

  const navigateTo = (page) => {
    if (!validPages.includes(page)) {
      return
    }
    const targetHash = `#/${page}`
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash
    }
    setCurrentPage(page)
  }

  useEffect(() => {
    const initialPage = getPageFromLocation()
    setCurrentPage(initialPage)

    if (!window.location.hash || !validPages.includes(normalizeRoute(window.location.hash))) {
      window.location.hash = `/${initialPage}`
    }

    const onHashChange = () => {
      setCurrentPage(getPageFromLocation())
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const togglePlatform = (platform) => {
    setActivePlatforms((currentPlatforms) => {
      if (currentPlatforms.includes(platform)) {
        return currentPlatforms.filter((item) => item !== platform)
      }

      return [...currentPlatforms, platform]
    })
  }

  const searchablePlaylists = [...featuredPlaylists, ...recentSharedPlaylists]
  const normalizedSearch = searchQuery.trim().toLowerCase()

  const filteredPlaylists = searchablePlaylists.filter((playlist) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [playlist.name, playlist.description, playlist.curator, playlist.mood]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)

    const matchesPlatform =
      activePlatforms.length === 0 || activePlatforms.some((platform) => playlist.sources.includes(platform))

    return matchesSearch && matchesPlatform
  })

  useEffect(() => {
    const query = songSearchQuery.trim()

    if (query.length < 2) {
      setSongSearchResults([])
      setSongSearchError('')
      setSongSearchUnavailableSources([])
      return
    }

    const timerId = window.setTimeout(async () => {
      setIsSongSearchLoading(true)
      const result = await searchSongs(query, activePlatforms, 10)
      setSongSearchResults(result.songs)
      setSongSearchError(result.error || '')
      setSongSearchUnavailableSources(result.unavailableSources || [])
      setIsSongSearchLoading(false)
    }, 350)

    return () => window.clearTimeout(timerId)
  }, [songSearchQuery, activePlatforms])

  const filteredMyPlaylists = myPlaylists
    .filter((pl) => playlistPlatform === 'All' || pl.sources.includes(playlistPlatform))
    .sort((a, b) => {
      if (playlistSort === 'name') return a.name.localeCompare(b.name)
      if (playlistSort === 'tracks') return b.tracks - a.tracks
      return 0
    })

  const handleCreatePlaylist = (event) => {
    event.preventDefault()
    const trimmed = newPlaylistName.trim()
    if (!trimmed) return
    setMyPlaylists((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: trimmed,
        tracks: 0,
        summary: 'Empty playlist — start adding tracks.',
        sources: [newPlaylistSource],
        updated: 'Just now',
      },
    ])
    setNewPlaylistName('')
    setNewPlaylistSource('Spotify')
    setIsCreatingPlaylist(false)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    const email = loginEmail.trim()
    const password = loginPassword

    if (!email || !password) {
      setLoginError('Please fill in all fields')
      return
    }

    try {
      const result = await login(email, password)
      setIsLoggedIn(true)
      setUserName(result.username)
      setUserId(result.userId)
      setLoginError('')
      setLoginEmail('')
      setLoginPassword('')
      navigateTo('home')
    } catch (error) {
      setLoginError(error.message)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    const email = registerEmail.trim()
    const firstName = registerFirstName.trim()
    const lastName = registerLastName.trim()
    const password = registerPassword

    if (!email || !firstName || !lastName || !password) {
      setRegisterError('Please fill in all fields')
      return
    }

    try {
      await register(email, firstName, lastName, password)
      setRegisterError('')
      setRegisterFirstName('')
      setRegisterLastName('')
      setRegisterEmail('')
      setRegisterPassword('')
      // After successful registration, redirect to login
      navigateTo('login')
    } catch (error) {
      setRegisterError(error.message)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserName('')
    setUserId(null)
    navigateTo('home')
  }

  const normalizeTrackText = (value) => {
    return String(value || '')
      .toLowerCase()
      .replace(/\([^)]*\)/g, ' ')
      .replace(/\[[^\]]*\]/g, ' ')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const getTrackTokens = (value) => {
    return normalizeTrackText(value).split(' ').filter(Boolean)
  }

  const getPlaybackMatchScore = (baseSong, candidateSong) => {
    if (!candidateSong || candidateSong.id === baseSong.id) return -1

    const baseTokens = getTrackTokens(`${baseSong.title} ${baseSong.artist}`)
    const candidateTokens = getTrackTokens(`${candidateSong.title} ${candidateSong.artist}`)

    const matches = baseTokens.filter(token => candidateTokens.includes(token)).length
    const totalTokens = Math.max(baseTokens.length, candidateTokens.length)

    if (totalTokens === 0) return 0
    return Math.round((matches / totalTokens) * 10)
  }

  const getEmbedUrl = (song) => {
    if (!song?.trackUrl) return null

    if (song.source === 'Spotify') {
      const match = song.trackUrl.match(/track\/([a-zA-Z0-9]+)/)
      return match ? `https://open.spotify.com/embed/track/${match[1]}` : null
    }

    if (song.source === 'YouTube') {
      try {
        const parsedUrl = new URL(song.trackUrl)
        const videoId = parsedUrl.searchParams.get('v')
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
        }
      } catch {
        return null
      }
      return null
    }

    if (song.source === 'SoundCloud') {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(song.trackUrl)}&auto_play=true`
    }

    return null
  }

  const getPlaybackCandidates = (song) => [song, ...songSearchResults, ...trendingSongs]

  const getFullPlaybackEntry = (song) => {
    const sourceBonus = {
      YouTube: 8,
      SoundCloud: 6,
      Spotify: 3,
    }

    return getPlaybackCandidates(song)
      .map((candidate) => {
        const embedUrl = getEmbedUrl(candidate)
        if (!embedUrl) return null

        const matchScore = candidate.id === song.id ? 18 : getPlaybackMatchScore(song, candidate)
        const score = matchScore + (sourceBonus[candidate.source] || 0)
        if (score < 6) return null

        return { candidate, embedUrl, score }
      })
      .filter(Boolean)
      .sort((left, right) => right.score - left.score)[0] || null
  }

  const getPreviewPlaybackEntry = (song) => {
    return getPlaybackCandidates(song)
      .map((candidate) => {
        if (!candidate.previewUrl) return null

        const score = candidate.id === song.id ? 18 : getPlaybackMatchScore(song, candidate)
        if (score < 6) return null

        return { candidate, score }
      })
      .filter(Boolean)
      .sort((left, right) => right.score - left.score)[0] || null
  }

  const getPlaybackNote = (requestedSong, playbackSong, mode) => {
    if (!playbackSong) return ''

    if (mode === 'embed') {
      if (requestedSong.source !== playbackSong.source) {
        return `Full track matched from ${playbackSong.source} for this song.`
      }

      return `Full playback via ${playbackSong.source}.`
    }

    if (requestedSong.source !== playbackSong.source) {
      return `Preview matched from ${playbackSong.source} while a full track was not available.`
    }

    return `Preview playback from ${playbackSong.source}.`
  }

  const closeActivePlayer = () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
    setCurrentPlayingSongId(null)
    setActivePlayer(null)
  }

  const handlePlaySong = async (song) => {
    const audio = audioRef.current
    if (!audio) return

    if (activePlayer?.type === 'embed' && activePlayer.requestedSongId === song.id) {
      closeActivePlayer()
      return
    }

    const fullPlaybackEntry = getFullPlaybackEntry(song)
    if (fullPlaybackEntry) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      setCurrentPlayingSongId(song.id)
      setActivePlayer({
        type: 'embed',
        title: song.title,
        artist: song.artist,
        source: fullPlaybackEntry.candidate.source,
        embedUrl: fullPlaybackEntry.embedUrl,
        requestedSongId: song.id,
        note: getPlaybackNote(song, fullPlaybackEntry.candidate, 'embed'),
      })
      return
    }

    const previewPlaybackEntry = getPreviewPlaybackEntry(song)
    const previewSong = previewPlaybackEntry?.candidate || song

    if (previewSong.previewUrl) {
      setActivePlayer({
        type: 'preview',
        title: song.title,
        artist: song.artist,
        source: previewSong.source,
        requestedSongId: song.id,
        note: getPlaybackNote(song, previewSong, 'preview'),
      })

      if (currentPlayingSongId === song.id && !audio.paused) {
        audio.pause()
        setCurrentPlayingSongId(null)
        setActivePlayer(null)
        return
      }

      try {
        audio.src = previewSong.previewUrl
        await audio.play()
        setCurrentPlayingSongId(song.id)
      } catch {
        setActivePlayer({
          type: 'unavailable',
          title: song.title,
          artist: song.artist,
          source: previewSong.source,
          requestedSongId: song.id,
          note: 'Playback not available for this track in CrossTunes.',
        })
      }
      return
    }

    setActivePlayer({
      type: 'unavailable',
      title: song.title,
      artist: song.artist,
      source: song.source || 'Unknown',
      requestedSongId: song.id,
      note: 'Playback not available for this track in CrossTunes.',
    })
  }

  const filterForbiddenChars = (value) => {
    const forbidden = ['<', '>', '/', '=', "'", '"', '\\'];
    return value.split('').filter(char => !forbidden.includes(char)).join('');
  }

  const handleRecommend = (event) => {
    event.preventDefault()
    if (!chatInput.trim()) { setChatHint('Type a playlist or song first.'); return }
    setChatHint('')
    setIsThinking(true)
    window.setTimeout(() => { setChatResult(getRecommendations(chatInput)); setIsThinking(false) }, 320)
  }

  const quickPrompts = ['Late Night Code playlist', 'Songs like Midnight Drive', 'Calm focus music']

  return (
    <>
      <header className="nav-shell">
      <nav className="container top-nav" aria-label="Main navigation">
        <div className="nav-primary">
          <a
            href="#/home"
            className="brand-lockup"
            onClick={(event) => {
              event.preventDefault()
              navigateTo('home')
            }}
            aria-label="CrossTunes home"
          >
            <span className="brand-badge">CT</span>
            <span className="brand-text">CrossTunes</span>
          </a>

          <div className="nav-links">
            <a
              href="#/home"
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={(event) => {
                event.preventDefault()
                navigateTo('home')
              }}
            >
              Home
            </a>
            <a
              href="#/playlists"
              className={`nav-link ${currentPage === 'playlists' ? 'active' : ''}`}
              onClick={(event) => {
                event.preventDefault()
                navigateTo('playlists')
              }}
            >
              My Playlists
            </a>
            <a
              href="#/friends"
              className={`nav-link ${currentPage === 'friends' ? 'active' : ''}`}
              onClick={(event) => {
                event.preventDefault()
                navigateTo('friends')
              }}
            >
              Friends
            </a>
          </div>
        </div>

        <div className="nav-secondary">
          {isLoggedIn ? (
            <>
              <span className="nav-user">Hello, {userName}!</span>
              <a
                href="#/logout"
                className="nav-utility"
                onClick={(event) => {
                  event.preventDefault()
                  handleLogout()
                }}
              >
                Log Out
              </a>
            </>
          ) : (
            <>
              <a
                href="#/login"
                className={`nav-utility ${currentPage === 'login' ? 'active' : ''}`}
                onClick={(event) => {
                  event.preventDefault()
                  navigateTo('login')
                }}
              >
                Log In
              </a>
              <a
                href="#/register"
                className={`nav-signup ${currentPage === 'register' ? 'nav-signup--active' : ''}`}
                onClick={(event) => {
                  event.preventDefault()
                  navigateTo('register')
                }}
              >
                Create Account
              </a>
            </>
          )}
        </div>
      </nav>
      </header>

      {currentPage === 'home' && (
        <main className="container page-shell">

          {/* ── Hero ── */}
          <section className="hub-hero">
            <p className="eyebrow">CrossTunes</p>
            {isLoggedIn ? (
              <>
                <h1>Hello, {userName}!</h1>
                <p className="hero-summary">Welcome back to your music discovery hub. Find and share tracks across Spotify, YouTube, and SoundCloud.</p>
              </>
            ) : (
              <>
                <h1>One search. Every platform.</h1>
                <p className="hero-summary">Find and share music across Spotify, YouTube, and SoundCloud in one place.</p>
              </>
            )}

            <div className="hero-stats">
              <span><strong>{trendingSongs.length}</strong> trending tracks</span>
              <span><strong>{featuredPlaylists.length + recentSharedPlaylists.length}</strong> shared playlists</span>
              <span><strong>{platformOptions.length}</strong> platforms</span>
            </div>

            <div className="search-bar-wrap">
              <label className="search-input-shell" htmlFor="music-search">
                <span className="search-icon" aria-hidden="true">&#9835;</span>
                <input
                  id="music-search"
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search artists, moods, curators, or playlist names…"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >✕</button>
                )}
              </label>
              <div className="platform-filter-row" aria-label="Filter by platform">
                {platformOptions.map((platform) => {
                  const isActive = activePlatforms.includes(platform)
                  return (
                    <button
                      key={platform}
                      type="button"
                      className={`platform-chip platform-chip--${platform.toLowerCase()} ${isActive ? 'active' : ''}`}
                      onClick={() => togglePlatform(platform)}
                    >
                      <span className="platform-chip-mark" aria-hidden="true">{sourceMarks[platform]}</span>
                      <span>{platform}</span>
                    </button>
                  )
                })}
                <span className="search-result-count">{filteredPlaylists.length} playlists</span>
              </div>
            </div>
          </section>

          {/* ── Song Search ── */}
          {isLoggedIn && (
            <section className="song-search-section">
              <h2 className="hub-section-title">Search Songs</h2>
              <div className="search-bar-wrap">
                <label className="search-input-shell" htmlFor="song-search">
                  <span className="search-icon" aria-hidden="true">&#9835;</span>
                  <input
                    id="song-search"
                    type="text"
                    value={songSearchQuery}
                    onChange={(event) => setSongSearchQuery(event.target.value)}
                    placeholder="Search for songs, artists, or albums..."
                  />
                  {songSearchQuery && (
                    <button
                      type="button"
                      className="search-clear-btn"
                      onClick={() => setSongSearchQuery('')}
                      aria-label="Clear song search"
                    >✕</button>
                  )}
                </label>
                <div className="platform-filter-row" aria-label="Filter by platform">
                  {platformOptions.map((platform) => {
                    const isActive = activePlatforms.includes(platform)
                    return (
                      <button
                        key={platform}
                        type="button"
                        className={`platform-chip platform-chip--${platform.toLowerCase()} ${isActive ? 'active' : ''}`}
                        onClick={() => togglePlatform(platform)}
                      >
                        <span className="platform-chip-mark" aria-hidden="true">{sourceMarks[platform]}</span>
                        <span>{platform}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {songSearchQuery.trim().length > 0 && (
                <div className="song-search-results">
                  {isSongSearchLoading && <p className="search-no-results">Searching songs...</p>}
                  {!isSongSearchLoading && songSearchError && <p className="search-no-results">{songSearchError}</p>}
                  {!isSongSearchLoading && !songSearchError && songSearchUnavailableSources.length > 0 && (
                    <p className="search-no-results">
                      Some sources are unavailable: {songSearchUnavailableSources.join(', ')}
                    </p>
                  )}
                  {!isSongSearchLoading && !songSearchError && songSearchResults.length === 0 && songSearchQuery.trim().length >= 2 && (
                    <p className="search-no-results">No song results found for "{songSearchQuery}".</p>
                  )}
                  {!isSongSearchLoading && !songSearchError && songSearchResults.length > 0 && (
                    <div className="song-grid">
                      {songSearchResults.map((song, i) => (
                        <SongCard
                          key={`song-${song.id}-${i}`}
                          song={{
                            id: song.id,
                            title: song.title,
                            artist: song.artist,
                            album: song.album,
                            duration: song.duration,
                            mood: song.genre,
                            source: song.source,
                            plays: 'Search',
                            previewUrl: song.previewUrl,
                            trackUrl: song.trackUrl,
                          }}
                          index={i}
                          comments={songComments[song.id] || []}
                          onAddComment={addSongComment}
                          onRemoveComment={removeSongComment}
                          onPlay={handlePlaySong}
                          isPlaying={currentPlayingSongId === song.id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* ── Live search results ── */}
          {normalizedSearch.length > 0 && (
            <section className="search-results-section">
              <div className="search-results-header">
                <span>Results for <em>"{searchQuery}"</em></span>
                <span className="search-result-pill">{filteredPlaylists.length} playlist{filteredPlaylists.length !== 1 ? 's' : ''}</span>
              </div>
              {filteredPlaylists.length > 0 ? (
                <div className="playlist-grid">
                  {filteredPlaylists.map((playlist) => (
                    <PlaylistCard
                      key={playlist.id}
                      playlist={playlist}
                      emphasis={featuredPlaylists.find((p) => p.id === playlist.id) ? 'featured-card' : 'recent-card'}
                    />
                  ))}
                </div>
              ) : (
                <p className="search-no-results">No playlists match. Try different keywords or platform filters.</p>
              )}
            </section>
          )}

          {/* ── Section jump tabs ── */}
          <nav className="section-tabs" aria-label="Jump to section">
            <a href="#trending" className="section-tab">Trending</a>
            <a href="#featured" className="section-tab">Featured</a>
            <a href="#shared" className="section-tab">Shared</a>
          </nav>

          {/* ── Trending Songs ── */}
          <section id="trending" className="hub-section">
            <h2 className="hub-section-title">Trending Tracks</h2>
            <div className="song-grid">
              {trendingSongs.map((song, i) => (
                <SongCard
                  key={song.id}
                  song={song}
                  index={i}
                  comments={songComments[song.id] || []}
                  onAddComment={addSongComment}
                  onRemoveComment={removeSongComment}
                  onPlay={handlePlaySong}
                  isPlaying={currentPlayingSongId === song.id}
                />
              ))}
            </div>
          </section>

          {/* ── Featured Playlists ── */}
          <section id="featured" className="hub-section">
            <h2 className="hub-section-title">Featured Community Playlists</h2>
            <div className="playlist-grid">
              {featuredPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} emphasis="featured-card" />
              ))}
            </div>
          </section>

          {/* ── Recently Shared ── */}
          <section id="shared" className="hub-section">
            <h2 className="hub-section-title">Recently Updated Shared Playlists</h2>
            <div className="playlist-grid">
              {recentSharedPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} emphasis="recent-card" />
              ))}
            </div>
          </section>

        </main>
      )}

      {currentPage === 'playlists' && (
        <main className="container page-shell pl-page">
          <div className="pl-page-header">
            <div className="pl-header-copy">
              <p className="eyebrow">My Playlists</p>
              <h1>Your shelves &amp; work-in-progress mixes.</h1>
              <p className="pl-header-sub">Keep your core listening stacks close while the hub handles discovery.</p>
            </div>
            <button
              type="button"
              className="btn-primary pl-new-btn"
              onClick={() => setIsCreatingPlaylist(true)}
            >
              + New Playlist
            </button>
          </div>

          <div className="pl-controls-row">
            <div className="pl-filter-row" role="group" aria-label="Filter by platform">
              {['All', ...platformOptions].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`pl-filter-chip ${playlistPlatform === opt ? 'active' : ''}`}
                  onClick={() => setPlaylistPlatform(opt)}
                >
                  {opt !== 'All' && (
                    <span className="pl-filter-mark" aria-hidden="true">{sourceMarks[opt]}</span>
                  )}
                  {opt}
                </button>
              ))}
            </div>

            <div className="pl-sort-row" role="group" aria-label="Sort playlists">
              <span className="pl-sort-label">Sort:</span>
              {[['updated', 'Recent'], ['name', 'Name'], ['tracks', 'Tracks']].map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  className={`pl-sort-chip ${playlistSort === val ? 'active' : ''}`}
                  onClick={() => setPlaylistSort(val)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filteredMyPlaylists.length > 0 ? (
            <section className="pl-grid" aria-label="Personal playlist library">
              {filteredMyPlaylists.map((playlist) => (
                <article key={playlist.id} className="pl-card">
                  <div className="pl-card-art" aria-hidden="true">
                    <span className="art-ring art-ring-one"></span>
                    <span className="art-ring art-ring-two"></span>
                    <span className="art-core"></span>
                  </div>
                  <div className="pl-card-body">
                    <div className="pl-card-meta-row">
                      <span className="pl-track-badge">{playlist.tracks} tracks</span>
                      <span className="pl-updated">{playlist.updated}</span>
                    </div>
                    <h2 className="pl-card-title">{playlist.name}</h2>
                    <p className="pl-card-summary">{playlist.summary}</p>
                  </div>
                  <div className="pl-card-footer">
                    <SourcePills sources={playlist.sources} />
                    <div className="pl-card-actions">
                      <button type="button" className="pl-action-btn">View</button>
                      <button type="button" className="pl-action-btn">Share</button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <div className="pl-empty-state">
              <span className="pl-empty-icon" aria-hidden="true">&#9835;</span>
              <h2>No playlists match this filter.</h2>
              <p>Try switching to a different platform or create a new playlist.</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setPlaylistPlatform('All')}
              >
                Show All
              </button>
            </div>
          )}

          {isCreatingPlaylist && (
            <div className="pl-modal-overlay" role="dialog" aria-modal="true" aria-label="Create new playlist">
              <div className="pl-modal">
                <div className="pl-modal-header">
                  <h2>New Playlist</h2>
                  <button
                    type="button"
                    className="pl-modal-close"
                    onClick={() => { setIsCreatingPlaylist(false); setNewPlaylistName('') }}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleCreatePlaylist} className="pl-modal-form">
                  <label htmlFor="pl-name-input" className="pl-modal-label">Playlist name</label>
                  <input
                    id="pl-name-input"
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="e.g. Late Night Session"
                    autoFocus
                    required
                  />
                  <label htmlFor="pl-source-select" className="pl-modal-label">Primary platform</label>
                  <select
                    id="pl-source-select"
                    value={newPlaylistSource}
                    onChange={(e) => setNewPlaylistSource(e.target.value)}
                  >
                    {platformOptions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <div className="pl-modal-actions">
                    <button type="submit" className="btn-primary">Create Playlist</button>
                    <button
                      type="button"
                      className="pl-cancel-btn"
                      onClick={() => { setIsCreatingPlaylist(false); setNewPlaylistName('') }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      )}

      {currentPage === 'friends' && (
        <main className="container page-shell stack-page">
          <div className="simple-page-header">
            <p className="eyebrow">Friends</p>
            <h1>Recent Activity</h1>
          </div>

          <section className="friends-activity-list" aria-label="Recent friend activity">
            {friendActivity.map((friend) => (
              <article key={friend.id} className="friend-card">
                <div className="friend-avatar" aria-hidden="true">
                  {friend.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </div>
                <div className="friend-copy">
                  <h2>{friend.name}</h2>
                  <p className="friend-status">{friend.status}</p>
                  <p>{friend.note}</p>
                </div>
              </article>
            ))}
          </section>
        </main>
      )}

      {currentPage === 'login' && (
        <main className="container auth-page">
          <div className="auth-card">
            <span className="brand-badge standalone-badge">CT</span>
            <h1>Log In</h1>
            <p className="auth-intro">Pick up where your shared listening sessions left off.</p>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(filterForbiddenChars(e.target.value))}
                placeholder="Email Address"
                required
              />
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(filterForbiddenChars(e.target.value))}
                placeholder="Password"
                required
              />
              {loginError && <p className="auth-error">{loginError}</p>}
              <button type="submit" className="btn-primary auth-submit">
                Enter CrossTunes
              </button>
              <p className="auth-switch">No account? <a href="#/register" onClick={(e) => { e.preventDefault(); navigateTo('register') }}>Create one free →</a></p>
            </form>
          </div>
        </main>
      )}

      <aside className="dj-widget-wrap" aria-label="CrossFade DJ recommender">
        <button
          type="button"
          className="dj-toggle-btn"
          onClick={() => setIsChatOpen((v) => !v)}
          aria-expanded={isChatOpen}
          aria-controls="dj-panel"
          title="CrossFade DJ"
        >
          {isChatOpen ? '✕' : 'DJ'}
        </button>

        {isChatOpen && (
          <div id="dj-panel" className="dj-panel">
            <div className="dj-panel-header">
              <div className="dj-live-chip" aria-hidden="true">
                <span className="dj-dot"></span>
                LIVE SET
              </div>
              <h3>CrossFade DJ</h3>
              <p>Scene-based mixes that adapt to your playlist mood.</p>
            </div>

            <form className="dj-form" onSubmit={handleRecommend}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => { setChatInput(e.target.value); if (chatHint) setChatHint('') }}
                placeholder="e.g. Focus Flow playlist"
                aria-label="Playlist or song input"
              />
              <div className="dj-form-actions">
                <button type="submit" className="btn-primary" disabled={isThinking}>
                  {isThinking ? 'Mixing...' : 'Drop Mix'}
                </button>
                <button type="button" className="dj-clear-btn" onClick={() => { setChatInput(''); setChatResult(null); setChatHint('') }}>
                  Clear
                </button>
              </div>
            </form>

            {chatHint && <p className="dj-hint">{chatHint}</p>}

            <div className="dj-quick-prompts">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="dj-prompt-chip"
                  disabled={isThinking}
                  onClick={() => {
                    setChatInput(prompt); setChatHint(''); setIsThinking(true)
                    window.setTimeout(() => { setChatResult(getRecommendations(prompt)); setIsThinking(false) }, 250)
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {isThinking && <p className="dj-thinking">Building your set...</p>}

            {!isThinking && chatResult && (
              <div className="dj-results">
                <p className="dj-scene">Scene: {chatResult.scene}</p>
                <p className="dj-host-line">{chatResult.hostLine}</p>
                <p className="dj-reason">{chatResult.reason}</p>
                <ul>
                  {chatResult.suggestions.map((track) => (
                    <li key={track.title}>
                      <span>{track.title} — {track.artist}</span>
                      <span className="dj-vibe">{track.vibe}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </aside>

      {currentPage === 'register' && (
        <main className="container auth-page">
          <div className="auth-card auth-card-wide">
            <span className="brand-badge standalone-badge">CT</span>
            <h1>Create Account</h1>
            <p className="auth-intro">Start building shared playlists that survive platform boundaries.</p>
            <form onSubmit={handleRegister}>
              <div className="name-row">
                <input
                  type="text"
                  value={registerFirstName}
                  onChange={(e) => setRegisterFirstName(filterForbiddenChars(e.target.value))}
                  placeholder="First Name"
                  required
                />
                <input
                  type="text"
                  value={registerLastName}
                  onChange={(e) => setRegisterLastName(filterForbiddenChars(e.target.value))}
                  placeholder="Last Name"
                  required
                />
              </div>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(filterForbiddenChars(e.target.value))}
                placeholder="Email Address"
                required
              />
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(filterForbiddenChars(e.target.value))}
                placeholder="Password"
                required
              />
              <input type="password" placeholder="Confirm Password" required />
              {registerError && <p className="auth-error">{registerError}</p>}
              <button type="submit" className="btn-primary auth-submit">
                Create CrossTunes Account
              </button>
              <p className="auth-switch">Already have an account? <a href="#/login" onClick={(e) => { e.preventDefault(); navigateTo('login') }}>Log in →</a></p>
            </form>
          </div>
        </main>
      )}
    </>
  )

  return (
    <>
      <header className="nav-shell">

      {activePlayer && (
        <section className="site-player-dock" aria-label="Now playing">
          <div className="site-player-head">
            <div>
              <p className="site-player-kicker">Now Playing on {activePlayer.source || 'CrossTunes'}</p>
              <h3>{activePlayer.title}</h3>
              <p>{activePlayer.artist}</p>
              {activePlayer.note ? <p className="site-player-note">{activePlayer.note}</p> : null}
            </div>
            <button type="button" className="site-player-close" onClick={closeActivePlayer} aria-label="Close player">✕</button>
          </div>

          {activePlayer.type === 'embed' && activePlayer.embedUrl && (
            <iframe
              className="site-player-embed"
              src={activePlayer.embedUrl}
              title={`${activePlayer.title} player`}
              allow="autoplay; encrypted-media; clipboard-write; fullscreen"
              loading="lazy"
            />
          )}

          {activePlayer.type === 'unavailable' && (
            <div className="site-player-unavailable">
              <p>This track is not available for playback in CrossTunes. Try searching for an alternative version across platforms.</p>
            </div>
          )}
        </section>
      )}

      <audio
        ref={audioRef}
        className={activePlayer?.type === 'preview' ? 'site-player-audio site-player-audio--active' : 'site-player-audio'}
        controls
        onEnded={() => setCurrentPlayingSongId(null)}
        onPause={() => {
          if (audioRef.current?.ended) return
          if (audioRef.current?.currentTime === 0) return
          setCurrentPlayingSongId(null)
          if (activePlayer?.type === 'preview') setActivePlayer(null)
        }}
      />
    </>
  )
}
