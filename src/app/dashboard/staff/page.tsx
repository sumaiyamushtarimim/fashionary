
'use client';

import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { staff } from "@/lib/placeholder-data";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function StaffPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <div className="flex-1">
            <h1 className="font-headline text-2xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground">Manage staff access and roles.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Invite Staff
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          {/* Table for larger screens */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                  <TableHead className="text-right">Total Due</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/staff/${member.id}`} className="hover:underline">
                        {member.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatDistanceToNow(new Date(member.lastLogin), { addSuffix: true })}
                    </TableCell>
                    <TableCell className={cn("text-right font-mono", member.financials.dueAmount > 0 ? "text-destructive" : "")}>
                        ${member.financials.dueAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/staff/${member.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Role</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Deactivate Account</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Card list for smaller screens */}
          <div className="sm:hidden space-y-4">
              {staff.map((member) => (
                  <Card key={member.id} className="overflow-hidden">
                      <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                              <div>
                                  <Link href={`/dashboard/staff/${member.id}`} className="font-semibold hover:underline">
                                      {member.name}
                                  </Link>
                                  <p className="text-sm text-muted-foreground">{member.email}</p>
                              </div>
                              <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                      <Button aria-haspopup="true" size="icon" variant="ghost">
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">Toggle menu</span>
                                      </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem asChild><Link href={`/dashboard/staff/${member.id}`}>View Details</Link></DropdownMenuItem>
                                      <DropdownMenuItem>Edit Role</DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600">Deactivate Account</DropdownMenuItem>
                                  </DropdownMenuContent>
                              </DropdownMenu>
                          </div>
                          <Separator />
                          <div className="flex justify-between items-end">
                              <Badge variant="outline">{member.role}</Badge>
                              <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Total Due</p>
                                  <p className={cn("font-semibold font-mono", member.financials.dueAmount > 0 ? "text-destructive" : "")}>
                                      ${member.financials.dueAmount.toFixed(2)}
                                  </p>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              ))}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
