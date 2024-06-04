import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import { usersList } from "@/reducers/tableReducer";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export function Tables() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchParam, setSearchParam] = useState("");

  //#region Data Fetching and Manipulation
  const fetchUsers = async (
    page = 1,
    size = 10,
    sortColumn = "",
    sortDirection = "",
    searchParam = ""
  ) => {
    setLoading(true);
    const params = {
      page: page,
      size: size,
      sortColumn: sortColumn,
      sortDirection: sortDirection,
      searchParam: searchParam,
    };

    try {
      const response = await dispatch(usersList(params));

      if (usersList.fulfilled.match(response)) {
        setData(response?.payload?.list);
        setTotalRows(response?.payload?.totalRecords);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const params = {
      page: currentPage,
      size: perPage,
      sortColumn,
      sortDirection,
      searchParam,
    };
    fetchUsers(currentPage, perPage, sortColumn, sortDirection, searchParam);
  }, [currentPage, perPage, sortColumn, sortDirection, searchParam]);
  //#endregion

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Users List
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Name", "Date of Birth", "Gender", "Phone", ""].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(
                ({ id, profile, userName, email, dob, gender, phoneNumber }, key) => {
                  const className = `py-3 px-5 ${
                    key === data.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (<>
                    <tr key={id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          {profile != null ? 
                            (<Avatar src={profile} alt={userName} size="sm" variant="rounded" />) : 
                            gender === "Male" ? 
                              (<Avatar src="https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg" alt={userName} size="sm" variant="rounded" />) :
                              (<Avatar src="https://static.vecteezy.com/system/resources/thumbnails/004/899/680/small/beautiful-blonde-woman-with-makeup-avatar-for-a-beauty-salon-illustration-in-the-cartoon-style-vector.jpg" alt={userName} size="sm" variant="rounded" />)

                          }
                          
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {userName}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {dob}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={gender === "Male" ? "blue" : "pink"}
                          value={gender === "Male" ? "Male" : "Female"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {phoneNumber}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          Edit
                        </Typography>
                      </td>
                    </tr>
                    </>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;
