ALTER TABLE publications
    ALTER COLUMN description TYPE TEXT[] USING ARRAY[description];
