1. Create `useMediaHome` hook in `src/hooks/useMediaHome.ts` to fetch latest 2 podcasts and 2 videos from Supabase. (Done)
2. Read the newly created file `src/hooks/useMediaHome.ts` to verify its contents. (Done)
3. Update `src/pages/Home.tsx` to include `useMediaHome` hook and render the `Latest Podcasts` and `Latest Videos` sections. (Done)
4. Create a custom branded audio player component `src/components/CustomAudioPlayer.tsx`.
5. Update `src/pages/Home.tsx` to use the new `CustomAudioPlayer` for podcasts.
6. Update `src/pages/Podcasts.tsx` to use the new `CustomAudioPlayer`.
7. Update the video player in `src/pages/Home.tsx` and `src/pages/Videos.tsx` to be more branded and modern.
8. Run project checks such as `npm run lint` and `npm run build` to ensure no regressions or type errors were introduced.
9. Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
10. Submit the change.
