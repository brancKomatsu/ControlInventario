CREATE VIEW [dbo].[tabla_Categoria]
AS
SELECT dbo.movimientos.asset, dbo.movimientos.alias, dbo.equipos.service_tag, dbo.equipos.creacion_equipo, dbo.equipos.eliminacion_equipo, dbo.equipos.documento_firmado, dbo.estado.nombre_status, dbo.lac.nombre_lac, dbo.movimientos.rut_persona, dbo.empleados.nombre, 
             dbo.empleados.apellido, dbo.ubicaciones.nombre_ubicacion, dbo.categorias.nombre_tabla AS tabla
FROM   dbo.movimientos INNER JOIN
             dbo.equipos ON dbo.movimientos.asset = dbo.equipos.asset_equipo INNER JOIN
             dbo.estado ON dbo.movimientos.estado = dbo.estado.id_estado INNER JOIN
             dbo.lac ON dbo.equipos.lac = dbo.lac.id_lac INNER JOIN
             dbo.empleados ON dbo.movimientos.rut_persona = dbo.empleados.rut INNER JOIN
             dbo.ubicaciones ON dbo.movimientos.ubicacion = dbo.ubicaciones.id_ubicacion INNER JOIN
             dbo.categorias ON dbo.equipos.categoria = dbo.categorias.id_categoria
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[67] 4[3] 2[24] 3) )"
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
         Left = 0
      End
      Begin Tables = 
         Begin Table = "movimientos"
            Begin Extent = 
               Top = 168
               Left = 511
               Bottom = 432
               Right = 773
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "equipos"
            Begin Extent = 
               Top = 127
               Left = 67
               Bottom = 324
               Right = 333
            End
            DisplayFlags = 280
            TopColumn = 3
         End
         Begin Table = "estado"
            Begin Extent = 
               Top = 242
               Left = 1221
               Bottom = 385
               Right = 1443
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "lac"
            Begin Extent = 
               Top = 432
               Left = 537
               Bottom = 576
               Right = 759
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "empleados"
            Begin Extent = 
               Top = 9
               Left = 802
               Bottom = 206
               Right = 1050
            End
            DisplayFlags = 280
            TopColumn = 2
         End
         Begin Table = "ubicaciones"
            Begin Extent = 
               Top = 240
               Left = 848
               Bottom = 383
               Right = 1097
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "categorias"
            Begin Extent = 
               Top = 1
               Left = 480
               Bottom = 144
               Right = 702
            End
            Displa' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'tabla_Categoria'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane2', @value=N'yFlags = 280
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
         Table = 1240
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
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'tabla_Categoria'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=2 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'tabla_Categoria'
GO


