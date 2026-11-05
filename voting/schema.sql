PRAGMA foreign_keys=ON;
CREATE TABLE polls(id TEXT PRIMARY KEY, question TEXT NOT NULL, options TEXT NOT NULL CHECK(json_valid(options)), mode TEXT NOT NULL CHECK(mode IN ('public','member')), starts INTEGER NOT NULL, ends INTEGER NOT NULL CHECK(ends>starts), status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','open','closed')), published INTEGER NOT NULL DEFAULT 0 CHECK(published IN (0,1)), minimum INTEGER NOT NULL CHECK(minimum>=10), max_choices INTEGER NOT NULL DEFAULT 1 CHECK(max_choices>=1 AND max_choices<=json_array_length(options)), version INTEGER NOT NULL DEFAULT 1, sections TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(sections)), deployed_at INTEGER);
-- No member names, emails, employment IDs or ballot-to-identity foreign key.
CREATE TABLE credentials(poll TEXT NOT NULL REFERENCES polls(id), digest TEXT NOT NULL, PRIMARY KEY(poll,digest));
CREATE TRIGGER credential_guard BEFORE INSERT ON credentials BEGIN
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM polls WHERE id=NEW.poll AND status='draft' AND mode='member') THEN RAISE(ABORT,'credentials_locked') END;
END;
CREATE TABLE spent(poll TEXT NOT NULL REFERENCES polls(id), digest TEXT NOT NULL, PRIMARY KEY(poll,digest));
CREATE TABLE ballots(id TEXT PRIMARY KEY, poll TEXT NOT NULL REFERENCES polls(id), choices TEXT NOT NULL CHECK(json_valid(choices) AND json_type(choices)='array'), note TEXT NOT NULL DEFAULT '' CHECK(length(note)<=1500));
CREATE TRIGGER ballot_guard BEFORE INSERT ON ballots BEGIN
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM polls WHERE id=NEW.poll AND status='open' AND starts<=unixepoch() AND ends>unixepoch() AND json_array_length(NEW.choices) BETWEEN 1 AND max_choices AND NOT EXISTS(SELECT 1 FROM json_each(NEW.choices) WHERE type!='integer' OR value<0 OR value>=json_array_length(polls.options)) AND (SELECT count(DISTINCT value) FROM json_each(NEW.choices))=json_array_length(NEW.choices)) THEN RAISE(ABORT,'poll_closed_or_invalid') END;
END;
CREATE TABLE limits(key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
CREATE TABLE audit(id TEXT PRIMARY KEY, at INTEGER NOT NULL, actor TEXT NOT NULL, action TEXT NOT NULL, poll TEXT NOT NULL, version INTEGER NOT NULL);
CREATE TRIGGER audit_no_update BEFORE UPDATE ON audit BEGIN SELECT RAISE(ABORT,'append_only'); END;
CREATE TRIGGER audit_no_delete BEFORE DELETE ON audit BEGIN SELECT RAISE(ABORT,'append_only'); END;
