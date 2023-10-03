select setval('organizations_seq', (SELECT MAX(id) FROM organizations));
