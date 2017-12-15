# funnelspike
Spike to demonstrate loading data into funnelback and performing geospatial searches

# notes
To use the load functionality you will need to create a Push collection, i.e at https://nhs-dev-search01.squiz.co.uk.
The admin API can be used to create a token once authenticated via the login API URL. 
This can be done from the page
https://nhs-dev-search01.squiz.co.uk/search/admin/api-ui/#!/user-account-management/loginUsingPOST

The returned x-security-token should be set to the env var `FUN_TOKEN`

Recent pharmacy data can be loaded via `node load`.
A single record can be read via `node read`.

For geospatial searches to work there must be lat-long cooordinates in the metadata, and the value specified in metamap.cfg.
The necessary metadata is addded during the load. To enable the search add `latLong,2,geoPosition` to the `metamap.cfg`.

Once the metamap.cfg file has been updated the collection can be re-indexed via the vacuum API https://nhs-dev-search01.squiz.co.uk/search/admin/api-ui/#!/push-api-collection/vacuumUsingPOST, specifying the collection name and 'RE_INDEX' on the drop down.

This can be done via 'Browse Collection Configuration Files' in the Administer tab at https://nhs-dev-search01.squiz.co.uk/search/admin/index.cgi
Searches my be performed against the endpoint via `https://nhs-dev-search01.squiz.co.uk/s/search.json?query=!FunDoesNotExist:PadreNul&collection=<collectionName>&maxdist=32.19&origin=54.159074,-0.897925&sort=prox`

Note: the `!FunDoesNotExist:PadreNul` is funnelback's way of searching for everything!

For an XML document fields to search on can be configured in the `xml.cfg` and `metamap.cfg`, i.e. to expose the pharmacy `identifier` field as `pharmcode`
add the line:

`pharmcode,1,,//identifier`

to xml.cfg [(more info on settings)](https://nhs-dev-search01.squiz.co.uk/search/admin/help/xml_cfg.html)

and the line:

`pharmcode,1,pharmcode`

to metamap.cfg [(more info on settings)](https://nhs-dev-search01.squiz.co.uk/search/admin/help/metamap_cfg.html)

the field can then be searched on via `fieldname:value`, i.e.

https://nhs-dev-search01.squiz.co.uk/s/search.html?collection=mark-test-xml&profile=_default_preview&query=pharmcode:FWM71
