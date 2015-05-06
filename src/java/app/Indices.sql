-----------------------------------------------------------------------------------------------------------------------------------------------
-- SELECT * FROM DBA_DATA_FILES;
-- ALTER DATABASE DATAFILE 'D:\ORACLEXE\ORADATA\XE\SYSTEM.DBF' RESIZE 2048M; 
-----------------------------------------------------------------------------------------------------------------------------------------------
CREATE INDEX IDX_RNC_FICHAORIGEM ON RNC(FICHAORIGEM);
CREATE INDEX IDX_RNC_FICHA ON RNC(FICHA);
CREATE INDEX IDX_MOVIMENTOS_FICHA ON MOVIMENTOS(FICHA);
-----------------------------------------------------------------------------------------------------------------------------------------------
CREATE INDEX "IX_FICHAS_PED" ON "FICHAS" ("PEDIDO", "ITEMPED");
CREATE INDEX "IX_FICHAS_STATUS" ON "FICHAS" ("STATUS", "NUMERO" DESC);
CREATE INDEX "IX_FICHAS_TIPO" ON "FICHAS" ("TIPO", "SUBTIPO");
CREATE INDEX "IX_FICHAS_DTCRIACAO" ON "FICHAS" ("DATACRIACAO");
-----------------------------------------------------------------------------------------------------------------------------------------------
