-- Seed radio episodes from Dropbox folder
-- Episodes 177-192 from Art of Rave 2025

INSERT INTO radio_episodes (episode_number, title, air_date, audio_url, cover_image_url, description, tracklist, display_order, is_published)
VALUES
  (177, 'Art of Rave #177', '2025-01-09', 
   'https://www.dropbox.com/scl/fo/9mvcraiygd1jrx03e90dc/AIHSu129vD-qYu1M2FknuoU/Episode%20177/Art%20of%20Rave%20%23177%20.mp3?rlkey=snxswbmg6aeb3rqobr7gfjvev&dl=1',
   'https://www.dropbox.com/scl/fo/9mvcraiygd1jrx03e90dc/AGcPmgsXJWrwcbiaL2-Z8as/Episode%20177/TG177.jpg?rlkey=snxswbmg6aeb3rqobr7gfjvev&dl=1',
   'Weekly electronic music show featuring the best tracks from around the globe', 
   ARRAY['Track listing available in episode'], 0, true),
  
  (178, 'Art of Rave - Episode 178', '2025-01-16',
   'https://www.dropbox.com/scl/fo/9mvcraiygd1jrx03e90dc/AHrkAFIuAkh-Er9bF1g11Hk/Episode%20178/Art%20of%20Rave%20-%20Episode%20178.mp3?rlkey=snxswbmg6aeb3rqobr7gfjvev&dl=1',
   'https://www.dropbox.com/scl/fo/9mvcraiygd1jrx03e90dc/AD6I0eNKO8AxXdPSL_w9GTk/Episode%20178/TG178.jpg?rlkey=snxswbmg6aeb3rqobr7gfjvev&dl=1',
   'Weekly electronic music show', ARRAY['Track listing available'], 1, true)
ON CONFLICT (episode_number) DO NOTHING;
