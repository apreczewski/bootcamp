import React from 'react';
import { Button } from 'shards-react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import { Container } from './styles';

export default function Dashboard() {
  return (
    <Container>
      <header>
        <Button>
          <MdChevronLeft size={36} color="#fff" />
        </Button>
        <Button>
          <MdChevronRight size={36} color="#fff" />
        </Button>
      </header>
    </Container>
  );
}
