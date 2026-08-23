import * as migration_20260625_154557 from './20260625_154557';
import * as migration_20260627_110508 from './20260627_110508';
import * as migration_20260627_112519 from './20260627_112519';
import * as migration_20260719_081834 from './20260719_081834';
import * as migration_20260719_084101 from './20260719_084101';

export const migrations = [
  {
    up: migration_20260625_154557.up,
    down: migration_20260625_154557.down,
    name: '20260625_154557',
  },
  {
    up: migration_20260627_110508.up,
    down: migration_20260627_110508.down,
    name: '20260627_110508',
  },
  {
    up: migration_20260627_112519.up,
    down: migration_20260627_112519.down,
    name: '20260627_112519',
  },
  {
    up: migration_20260719_081834.up,
    down: migration_20260719_081834.down,
    name: '20260719_081834',
  },
  {
    up: migration_20260719_084101.up,
    down: migration_20260719_084101.down,
    name: '20260719_084101'
  },
];
