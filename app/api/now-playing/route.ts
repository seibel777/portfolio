import { NextResponse } from "next/server";

const LASTFM_ENDPOINT = "https://ws.audioscrobbler.com/2.0/";

type LastFmTrack = {
  name?: string;
  url?: string;
  artist?: { "#text"?: string };
  image?: Array<{ "#text"?: string; size?: string }>;
  ["@attr"]?: { nowplaying?: string };
};

type LastFmResponse = {
  recenttracks?: {
    track?: LastFmTrack[] | LastFmTrack;
  };
};

const pickTrack = (data: LastFmResponse) => {
  const track = data?.recenttracks?.track;
  if (!track) {
    return null;
  }
  return Array.isArray(track) ? track[0] ?? null : track;
};

const pickAlbumImage = (track: LastFmTrack | null) => {
  if (!track?.image?.length) {
    return "";
  }
  const sizeOrder = ["extralarge", "large", "medium", "small"];
  const image = sizeOrder
    .map((size) => track.image?.find((item) => item.size === size))
    .find((item) => item?.["#text"]);
  return image?.["#text"] ?? "";
};

export async function GET() {
  try {
    const apiKey = process.env.LASTFM_API_KEY;
    const username = process.env.LASTFM_USERNAME;

    if (!apiKey || !username) {
      throw new Error("Missing Last.fm credentials");
    }

    const params = new URLSearchParams({
      method: "user.getrecenttracks",
      user: username,
      api_key: apiKey,
      format: "json",
      limit: "1"
    });

    const response = await fetch(`${LASTFM_ENDPOINT}?${params.toString()}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Last.fm request failed");
    }

    const data = (await response.json()) as LastFmResponse;
    const track = pickTrack(data);

    if (!track) {
      return NextResponse.json({
        title: "Not Playing",
        artist: "",
        songUrl: "",
        albumImageUrl: "",
        isPlaying: false
      });
    }

    return NextResponse.json({
      title: track.name ?? "Unknown",
      artist: track.artist?.["#text"] ?? "",
      songUrl: track.url ?? "",
      albumImageUrl: pickAlbumImage(track),
      isPlaying: track["@attr"]?.nowplaying === "true"
    });
  } catch (error) {
    return NextResponse.json(
      {
        title: "Failed to load",
        artist: "",
        songUrl: "",
        albumImageUrl: "",
        isPlaying: false
      },
      { status: 200 }
    );
  }
}
