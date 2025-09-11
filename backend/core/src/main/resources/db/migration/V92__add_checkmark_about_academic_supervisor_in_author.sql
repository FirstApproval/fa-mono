ALTER TABLE publications_authors ADD is_academic_supervisor BOOLEAN DEFAULT false;
ALTER TABLE publications_authors ALTER is_academic_supervisor DROP DEFAULT;
