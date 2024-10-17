  select max(date_format(exportdate,'%Y-%m-%d')) into @lastExportDate from mis_export_log;
  insert into scanned (locationid, locationname, lotno, filebarcode, filetype, casenature, casetypename, casetypecode,
   receivedfrom, receiveddate, inventorydate, inventoryuser, inventoryfiles, inventoryimages)
  SELECT  lpad(sl.locationid,3,'0') 'locationid',am.locationname,sl.lotno,sl.filebarcode, i.filetypecode,i.naturetype,''
  ,i.billtypecode,i.ReceivedBy,i.ReceivedDate,date_format(inventorydatetime,'%Y-%m-%d'),i.OppositPartyName,'1',i.totalpages
FROM statuslog sl
  inner join locationmaster am
  on lpad(sl.locationid,3,'0')=lpad(am.locationcode,3,'0')
  inner join inventory_details i on lpad(i.locationcode,3,'0')=lpad(sl.locationid,3,'0') and i.lotno=sl.lotno
  and i.filebarcode=sl.filebarcode
        order by am.locationname,sl.lotno,date_format(inventorydatetime,'%Y-%m-%d');
END IF;
update scanned s inner join billtypemaster b on s.casetypecode=b.billtypecode
set s.casetypename=b.billtypename;
update scanned s inner join master_naturetype b on s.casenature=b.id
set s.casenature=b.naturetype ;
update scanned s inner join filetypemaster b on s.filetype=b.filetypecode
set s.filetype=b.filetypename;
update scanned s inner join statuslog sl
on s.locationid=sl.locationid and s.lotno=sl.lotno and s.filebarcode=sl.filebarcode
set s.scandate=date_format(sl.scanningendtime,'%Y-%m-%d'),s.scanuser=sl.scanninguserid, s.scanfiles='1', s.scanimages=sl.scanningimages where scanningstatus='Y';
update scanned s inner join statuslog sl
on s.locationid=sl.locationid and s.lotno=sl.lotno and s.filebarcode=sl.filebarcode
set s.qcdate=date_format(sl.qcendtime,'%Y-%m-%d'),s.qcuser=sl.qcuserid, s.qcfiles='1', s.qcimages=sl.qcimages where qcstatus='Y';
update scanned s inner join statuslog sl
on s.locationid=sl.locationid and s.lotno=sl.lotno and s.filebarcode=sl.filebarcode
set s.flaggingdate=date_format(sl.flaggingendtime,'%Y-%m-%d'),s.flagginguser=sl.flagginguserid, s.flaggingfiles='1', s.flaggingimages=sl.flaggingimages where flaggingstatus='Y';
update scanned s inner join statuslog sl
on s.locationid=sl.locationid and s.lotno=sl.lotno and s.filebarcode=sl.filebarcode
set s.indexdate=date_format(sl.indexingendtime,'%Y-%m-%d'),s.indexuser=sl.indexinguserid, s.indexfiles='1', s.indeximages=sl.indexingimages where indexingstatus='Y';
update scanned s inner join statuslog sl
on s.locationid=sl.locationid and s.lotno=sl.lotno and s.filebarcode=sl.filebarcode
set s.cbslqadate=date_format(sl.cbslqaendtime,'%Y-%m-%d'),s.cbslqauser=sl.cbslqauserid, s.cbslqafiles='1', s.cbslqaimages=sl.cbslqaimages where cbslqastatus='Y';
update scanned s inner join statuslog sl
on s.locationid=sl.locationid and s.lotno=sl.lotno and s.filebarcode=sl.filebarcode
set exportdate=date_format(exppdfendtime,'%Y-%m-%d'), s.exportpdfuser=sl.exppdfuserid, s.exportpdffiles='1', s.exportpdfimages=sl.exppdfmages where exppdfstatus='Y';
update scanned s inner join statuslog sl
on s.locationid=sl.locationid and s.lotno=sl.lotno and s.filebarcode=sl.filebarcode
set clientqaacceptdate=date_format(clientqcendtime,'%Y-%m-%d'), s.clientqaacceptuser=sl.clientqcuserid,
s.clientqaacceptfiles='1', s.clientqaacceptimages=sl.clientqcimages
where clientqcstatus='Y';
update scanned s inner join statuslog sl
on s.locationid=sl.locationid and s.lotno=sl.lotno and s.filebarcode=sl.filebarcode
set clientqarejectdate=date_format(clientqcendtime,'%Y-%m-%d'), s.clientqarejectuser=sl.clientqcuserid,
s.clientqarejectfiles='1', s.clientqarejectimages=sl.clientqcimages
where cbslqastatus='P' and clientqcstatus='N';
update scanned s inner join statuslog sl
on s.locationid=sl.locationid and s.lotno=sl.lotno and s.filebarcode=sl.filebarcode
set s.digisigndate=date_format(sl.digiendtime,'%Y-%m-%d'),s.digisignuser=sl.digiusername,
s.digisignfiles='1', s.digisignimages=sl.digiimages where digistatus='Y';
