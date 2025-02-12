create view [dbo].[Columnas_empleados] as
select column_name 
from information_schema.columns 
where table_name='empleados'
GO


