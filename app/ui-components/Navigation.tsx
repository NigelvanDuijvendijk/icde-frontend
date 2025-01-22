import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar,
  } from "@nextui-org/react";
import { useAuth } from "../contexts/AuthProvider";

  export const AcmeLogo = () => {
    return (
      <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
        <path
          clipRule="evenodd"
          d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  };
export default function Navigation() {
  const { user, authenticationToken, logout } = useAuth();

  return (
    <Navbar>
    <NavbarBrand>
      <AcmeLogo />
      <p className="font-bold text-inherit">ICDE</p>
    </NavbarBrand>

    <NavbarContent className="hidden sm:flex gap-4" justify="center">
    <NavbarItem>
        <Link color="foreground" href="/">
          Home
        </Link>
      </NavbarItem>
      { user != undefined && authenticationToken !== undefined &&
        <NavbarItem>
          <Link color="foreground" href="/onderwijseenheden">
            Onderwijseenheden
          </Link> 
        </NavbarItem>
      }
      { user != undefined && authenticationToken !== undefined &&
        <NavbarItem>
          <Link color="foreground" href="/templates">
            Templates
          </Link> 
        </NavbarItem>
      }
     { user != undefined && authenticationToken !== undefined &&
        <NavbarItem>
          <Link color="foreground" href="/methodieken">
            Methodieken
          </Link> 
        </NavbarItem>
      }
      { user != undefined && authenticationToken !== undefined &&
        <NavbarItem>
          <Link color="foreground" href="/opleidingsprofielen">
            Opleidingsprofielen
          </Link> 
        </NavbarItem>
      }
      { user != undefined && authenticationToken !== undefined &&
        <NavbarItem>
          <Link color="foreground" href="/opleidingen">
            Opleidingen
          </Link> 
        </NavbarItem>
      }
    </NavbarContent>

    { user != undefined && authenticationToken !== undefined &&
      <NavbarContent as="div" justify="end"> 
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Ingelogd als</p>
              <p className="font-semibold">{user.email}</p>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={logout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    }
  </Navbar>
  );
}