# Battery-Manager Backend API

1. Add sort filter endpoint for a route, based on Criteria, rating, grade.
2. Why have a ratings enpoint when you do a POST with rating in Log Ascent ?


Fix broken accs values

UPDATE public.user_entity
	SET height=1, "unitSystem"='Feet', "totalClimbs"=0, "shadowBanned"=null, "statusId"=0, "currentGymId"=null, "totalSends"=0, "boulderGrade"='[6]', "routeGrade"='[1]', "topGrade"=1, "routeGradeSystem"='French', "boulderGradeSystem"='ebleau'  
	WHERE "boulderGrade"='';