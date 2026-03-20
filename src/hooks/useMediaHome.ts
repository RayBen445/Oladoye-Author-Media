import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

type Podcast = {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  cover_image_url: string;
  duration: string;
  published_at: string;
  likes?: number;
};

type VideoItem = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  published_at: string;
  likes?: number;
};

export function useMediaHome() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true);

        const fetchPodcasts = supabase
          .from('podcasts')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(2);

        const fetchVideos = supabase
          .from('videos')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(2);

        const [podcastsRes, videosRes] = await Promise.all([fetchPodcasts, fetchVideos]);

        if (!podcastsRes.error) {
            setPodcasts(podcastsRes.data as Podcast[]);
        } else if (podcastsRes.error.code !== '42P01') {
            console.error("Error fetching podcasts:", podcastsRes.error);
        }

        if (!videosRes.error) {
            setVideos(videosRes.data as VideoItem[]);
        } else if (videosRes.error.code !== '42P01') {
            console.error("Error fetching videos:", videosRes.error);
        }

      } catch (err) {
        console.error("Error fetching media for home page:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, []);

  return { podcasts, videos, loading };
}
