package com.excelr.project.travel.planner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.excelr.project.travel.planner.entity.Destination;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
	@Query(value = """
		    SELECT * FROM (
		        SELECT d.*, ROWNUM rnum
		        FROM destinations d
		        WHERE ROWNUM <= :endRow
		    )
		    WHERE rnum > :startRow
		    """, nativeQuery = true)
		List<Destination> findDestinationsPaginated(@Param("startRow") int startRow, @Param("endRow") int endRow);
}
