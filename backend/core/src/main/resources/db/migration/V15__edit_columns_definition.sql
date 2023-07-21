ALTER TABLE publications
    ALTER COLUMN object_of_study_description TYPE TEXT[] USING ARRAY[object_of_study_description],
    ALTER COLUMN software TYPE TEXT[] USING ARRAY[software],
    ALTER COLUMN method_description TYPE TEXT[] USING ARRAY[method_description],
    ALTER COLUMN predicted_goals TYPE TEXT[] USING ARRAY[predicted_goals];
