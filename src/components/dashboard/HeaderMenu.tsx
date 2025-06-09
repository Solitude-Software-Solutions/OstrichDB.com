// import { IconChevronDown } from '@tabler/icons-react';
import { Container, Group } from "@mantine/core";
// import { MantineLogo } from '@mantinex/mantine-logo';
import classes from "./HeaderMenu.module.css";
import ThemeToggle from "../common/ThemeToggle";
import { Circle, HelpCircleIcon } from "lucide-react";

const HeaderMenu: React.FC = () => {
  return (
    <header className={classes.header}>
      <Container size="fluid" px={0}>
        <div className={classes.inner}>
          <a href="#" className="flex items-center space-x-2">
            <span className="font-bold text-xl">
              <span className="logo-text-primary">Ostrich</span>
              <span className="logo-text-secondary">DB</span>
            </span>
          </a>
          <Group gap={5} visibleFrom="sm">
            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              {/* <a href="#" className="text-sb-cream hover:text-white transition-colors">
              <Github size={20} />
            </a> */}

              <HelpCircleIcon
                size={30}
                className=" text-sb-cream hover:text-white transition-colors cursor-pointer"
              />
              <Circle
                size={30}
                className=" text-sb-cream hover:text-white transition-colors cursor-pointer"
              />
            </div>
          </Group>
        </div>
      </Container>
    </header>
  );
};

export default HeaderMenu;
