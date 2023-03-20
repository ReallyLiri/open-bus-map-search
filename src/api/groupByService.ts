import { useEffect, useState } from 'react'
import { BASE_PATH } from './apiConfig'
import agencyList from 'open-bus-stride-client/agencies/agencyList'
import { Moment } from 'moment'

type groupByField = 'gtfs_route_date' | 'operator_ref' | 'day_of_week'
type groupByFields =
  | groupByField
  | `${groupByField},${groupByField}`
  | `${groupByField},${groupByField},${groupByField}`

type Identity<T> = { [P in keyof T]: T[P] }
type Replace<T, K extends keyof T, TReplace> = Identity<
  Pick<T, Exclude<keyof T, K>> & {
    [P in K]: TReplace
  }
>

/*
example response
[
  {
    "gtfs_route_date": "2023-02-27",
    "operator_ref": 0,
    "day_of_week": "string",
    "total_routes": 0,
    "total_planned_rides": 0,
    "total_actual_rides": 0
  }
]
*/
export type GroupByResponse = {
  gtfs_route_date: string
  operator_ref: number
  day_of_week: string
  total_routes: number
  total_planned_rides: number
  total_actual_rides: number
}[]

async function groupbyAsync({
  dateTo,
  dateFrom,
  groupBy,
}: {
  dateTo: Moment
  dateFrom: Moment
  groupBy: groupByFields
}): Promise<GroupByResponse> {
  // example: https://open-bus-stride-api.hasadna.org.il/gtfs_rides_agg/group_by?date_from=2023-01-27&date_to=2023-01-29&group_by=operator_ref
  const dateToStr = dateTo.toISOString().split('T')[0]
  const dateFromStr = dateFrom.toISOString().split('T')[0]
  return (
    await fetch(
      `${BASE_PATH}/gtfs_rides_agg/group_by?date_from=${dateFromStr}&date_to=${dateToStr}&group_by=${groupBy}`,
    )
  ).json()
}

export function useGroupBy({
  dateTo,
  dateFrom,
  groupBy,
}: {
  dateTo: Moment
  dateFrom: Moment
  groupBy: groupByFields
}) {
  const [data, setData] = useState<
    Replace<
      GroupByResponse[0],
      'operator_ref',
      | {
          agency_id: string
          agency_name: string
          agency_url: string
          agency_timezone: string
          agency_lang: string
          agency_phone: string
          agency_fare_url: string
        }
      | undefined
    >[]
  >([])

  useEffect(() => {
    groupbyAsync({ dateTo, dateFrom, groupBy }).then((data) =>
      setData(
        data.map((dataRecord) => ({
          ...dataRecord,
          operator_ref: agencyList.find(
            (agency) => agency.agency_id === String(dataRecord.operator_ref),
          ),
        })),
      ),
    )
  }, [+dateTo, +dateFrom, groupBy])

  return data
}

export default groupbyAsync
