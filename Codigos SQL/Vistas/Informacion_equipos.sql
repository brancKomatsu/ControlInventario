CREATE VIEW [dbo].[Informacion_equipos]
AS
SELECT dbo.categorias.nombre_tabla AS categoria, dbo.movimientos.asset, dbo.equipos.service_tag, dbo.movimientos.ultima_modificacion, dbo.estado.nombre_status AS estado, dbo.ubicaciones.nombre_ubicacion AS ubicacion, dbo.movimientos.alias, dbo.lac.nombre_lac, 
             dbo.empleados.nombre, dbo.empleados.apellido
FROM   dbo.movimientos INNER JOIN
             dbo.empleados ON dbo.movimientos.rut_persona = dbo.empleados.rut INNER JOIN
             dbo.ubicaciones ON dbo.movimientos.ubicacion = dbo.ubicaciones.id_ubicacion INNER JOIN
             dbo.estado ON dbo.movimientos.estado = dbo.estado.id_estado INNER JOIN
             dbo.equipos ON dbo.movimientos.asset = dbo.equipos.asset_equipo INNER JOIN
             dbo.categorias ON dbo.equipos.categoria = dbo.categorias.id_categoria INNER JOIN
             dbo.lac ON dbo.equipos.lac = dbo.lac.id_lac
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[33] 4[3] 2[49] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = -601
      End
      Begin Tables = 
         Begin Table = "movimientos"
            Begin Extent = 
               Top = 9
               Left = 641
               Bottom = 206
               Right = 903
            End
            DisplayFlags = 280
            TopColumn = 2
         End
         Begin Table = "empleados"
            Begin Extent = 
               Top = 9
               Left = 336
               Bottom = 206
               Right = 584
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "ubicaciones"
            Begin Extent = 
               Top = 327
               Left = 1012
               Bottom = 470
               Right = 1261
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "estado"
            Begin Extent = 
               Top = 9
               Left = 1266
               Bottom = 152
               Right = 1488
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "equipos"
            Begin Extent = 
               Top = 9
               Left = 1545
               Bottom = 206
               Right = 1801
            End
            DisplayFlags = 280
            TopColumn = 3
         End
         Begin Table = "categorias"
            Begin Extent = 
               Top = 9
               Left = 57
               Bottom = 152
               Right = 279
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "lac"
            Begin Extent = 
               Top = 183
               Left = 1850
               Bottom = 326
               Right = 2072
            End
            Displ' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'Informacion_equipos'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane2', @value=N'ayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'Informacion_equipos'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=2 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'Informacion_equipos'
GO


