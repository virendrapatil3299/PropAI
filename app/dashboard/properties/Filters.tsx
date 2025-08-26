import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

type FilterType = {
  query: string
  statusType: string
  price: string
  bedsBaths: string
  homeType: string
  more: string
}

type FiltersProps = {
  filter: FilterType
  setFilter: (f: FilterType) => void
}

export default function Filters({ filter, setFilter }: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center p-1 bg-white  shadow-sm border border-gray-200">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[260px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search by city, ZIP, or address"
          value={filter.query}
          onChange={(e) => setFilter({ ...filter, query: e.target.value })}
          className="pl-9 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm"
        />
      </div>

      {/* Status */}
      <Select
        value={filter.statusType || "all"}
        onValueChange={(v) => setFilter({ ...filter, statusType: v })}
      >
        <SelectTrigger className="w-32 rounded-xl border-gray-300 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-200">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="For Sale">For Sale</SelectItem>
          <SelectItem value="Sold">Sold</SelectItem>
          <SelectItem value="For Rent">For Rent</SelectItem>
        </SelectContent>
      </Select>

      {/* Price */}
      <Select
        value={filter.price || "all"}
        onValueChange={(v) => setFilter({ ...filter, price: v })}
      >
        <SelectTrigger className="w-28 rounded-xl border-gray-300 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-200">
          <SelectValue placeholder="Price" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any</SelectItem>
          <SelectItem value="0-100k">$0 - $100k</SelectItem>
          <SelectItem value="100k-500k">$100k - $500k</SelectItem>
          <SelectItem value="500k+">$500k+</SelectItem>
        </SelectContent>
      </Select>

      {/* Beds & Baths */}
      <Select
        value={filter.bedsBaths || "all"}
        onValueChange={(v) => setFilter({ ...filter, bedsBaths: v })}
      >
        <SelectTrigger className="w-36 rounded-xl border-gray-300 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-200">
          <SelectValue placeholder="Beds & Baths" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any</SelectItem>
          <SelectItem value="1">1+</SelectItem>
          <SelectItem value="2">2+</SelectItem>
          <SelectItem value="3">3+</SelectItem>
          <SelectItem value="4">4+</SelectItem>
        </SelectContent>
      </Select>

      {/* Home Type */}
      {/* <Select
        value={filter.homeType || "all"}
        onValueChange={(v) => setFilter({ ...filter, homeType: v })}
      >
        <SelectTrigger className="w-36 rounded-xl border-gray-300 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-200">
          <SelectValue placeholder="Home Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="House">House</SelectItem>
          <SelectItem value="Condo">Condo</SelectItem>
          <SelectItem value="Townhouse">Townhouse</SelectItem>
        </SelectContent>
      </Select> */}

      {/* More */}
      {/* <Select
        value={filter.more || "all"}
        onValueChange={(v) => setFilter({ ...filter, more: v })}
      >
        <SelectTrigger className="w-28 rounded-xl border-gray-300 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-200">
          <SelectValue placeholder="More" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="new">New Listings</SelectItem>
          <SelectItem value="open_house">Open Houses</SelectItem>
        </SelectContent>
      </Select> */}

      {/* Save Search Button */}
      <Button className="rounded-xl px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow">
        Save Search
      </Button>
    </div>
  )
}
