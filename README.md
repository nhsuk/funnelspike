# funnelspike
Spike to demonstrate loading data into funnelback and performing geospatial searches

# notes
To use the load functionality you will need to create a Push collection, i.e at https://nhs-dev-search01.squiz.co.uk.
The admin API can be used to create a token once authenticated via the login API URL. 
This can be done from the page
https://nhs-dev-search01.squiz.co.uk/search/admin/api-ui/#!/user-account-management/loginUsingPOST

The returned x-security-token should be set to the env var `FUN_TOKEN`

Recent pharmacy data can be loaded via `yarn load`.
A single record can be read via `yarn read`.

For geospatial searches to work there must be lat-long cooordinates in the metadata, and the value specified in metamap.cfg.
The necessary metadata is addded during the load. To enable the search add `latLong,2,geoPosition` to the `metamap.cfg`.

Sample `xml.cfg`, `collection.cfg` and `metamap.cfg` are included to demonstrate the correct configuration for the working searches.
A collection's files can be edited via 'Browse Collection Configuration Files' in the Administer tab at https://nhs-dev-search01.squiz.co.uk/search/admin/index.cgi

Once the files have been updated the collection can be re-indexed via the vacuum API https://nhs-dev-search01.squiz.co.uk/search/admin/api-ui/#!/push-api-collection/vacuumUsingPOST, specifying the collection name and 'RE_INDEX' on the drop down.

#Implementation Notes
Each individual pharmacy record has been unwound to create a record per opening time session and alteration time.

This is to overcome the limitations in Funnelback where an array of values cannot be searched on.

Opening times are stored as encoded JSON due to issues with encoding altTimes fields that start with a number.

An 'isMaster' field is set to 'true' on the first record of any pharmacy code. This can be used in the query to avoid duplicates when not searching for a specific time.

#General Notes

Searches my be performed against the endpoint via `https://nhs-dev-search01.squiz.co.uk/s/search.json?query=!FunDoesNotExist:PadreNul&collection=<collectionName>&maxdist=32.19&origin=54.159074,-0.897925&sort=prox`

Note: the `!FunDoesNotExist:PadreNul` is funnelback's way of searching for everything, by checking for a property that definitely doesn't exist.

For an XML document fields to search on can be configured in the `xml.cfg` and `metamap.cfg`, i.e. to expose the pharmacy `identifier` field as `pharmcode`
add the line:

`pharmcode,1,,//identifier`

to xml.cfg [(more info on settings)](https://nhs-dev-search01.squiz.co.uk/search/admin/help/xml_cfg.html)

and the line:

`pharmcode,1,pharmcode`

to metamap.cfg [(more info on settings)](https://nhs-dev-search01.squiz.co.uk/search/admin/help/metamap_cfg.html)

the field can then be searched on via `fieldname:value`, i.e.

https://nhs-dev-search01.squiz.co.uk/s/search.html?collection=mark-test-xml&profile=_default_preview&query=pharmcode:FWM71
