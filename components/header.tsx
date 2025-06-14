"use client"

import { useCivic } from "@/app/providers/civic-provider"
import { Button } from "@/components/ui/button"
import { Shield, LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  const { user, isAuthenticated, logout } = useCivic()

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Medilocker
            </h1>
            <p className="text-xs text-gray-500">Secure Medical Records</p>
          </div>
        </div>

        {isAuthenticated && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-105 transition-transform">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className="font-mono">
                      {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
