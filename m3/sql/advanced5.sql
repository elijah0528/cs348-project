DROP TRIGGER IF EXISTS before_posts_insert ON posts;
DROP FUNCTION IF EXISTS enforce_post_rate_limit();
CREATE FUNCTION enforce_post_rate_limit() RETURNS trigger LANGUAGE plpgsql AS $rl$ BEGIN IF EXISTS (
  SELECT 1
  FROM posts p
  WHERE p.user_id = NEW.user_id
    AND p.created_at > (NEW.created_at - INTERVAL '30 seconds')
) THEN RAISE EXCEPTION 'Rate limit exceeded';
END IF;
RETURN NEW;
END;
$rl$;
CREATE TRIGGER before_posts_insert BEFORE
INSERT ON posts FOR EACH ROW EXECUTE FUNCTION enforce_post_rate_limit();