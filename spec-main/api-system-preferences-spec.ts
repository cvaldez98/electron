import { expect } from 'chai'
import { systemPreferences } from 'electron'
import { ifdescribe } from './spec-helpers'

describe('systemPreferences module', () => {
  ifdescribe(process.platform === 'win32')('systemPreferences.getAccentColor', () => {
    it('should return a non-empty string', () => {
      const accentColor = systemPreferences.getAccentColor()
      expect(accentColor).to.be.a('string').that.is.not.empty('accent color')
    })
  })

  ifdescribe(process.platform === 'win32')('systemPreferences.getColor(id)', () => {
    it('throws an error when the id is invalid', () => {
      expect(() => {
        systemPreferences.getColor('not-a-color' as any)
      }).to.throw('Unknown color: not-a-color')
    })

    it('returns a hex RGB color string', () => {
      expect(systemPreferences.getColor('window')).to.match(/^#[0-9A-F]{6}$/i)
    })
  })

  ifdescribe(process.platform === 'darwin')('systemPreferences.registerDefaults(defaults)', () => {
    it('registers defaults', () => {
      const defaultsMap = [
        { key: 'one', type: 'string', value: 'ONE' },
        { key: 'two', value: 2, type: 'integer' },
        { key: 'three', value: [1, 2, 3], type: 'array' }
      ]

      const defaultsDict: Record<string, any> = {}
      defaultsMap.forEach(row => { defaultsDict[row.key] = row.value })

      systemPreferences.registerDefaults(defaultsDict)

      for (const userDefault of defaultsMap) {
        const { key, value: expectedValue, type } = userDefault
        const actualValue = systemPreferences.getUserDefault(key, type as any)
        expect(actualValue).to.deep.equal(expectedValue)
      }
    })

    it('throws when bad defaults are passed', () => {
      const badDefaults = [
        1,
        null,
        new Date(),
        { 'one': null }
      ]

      for (const badDefault of badDefaults) {
        expect(() => {
          systemPreferences.registerDefaults(badDefault as any)
        }).to.throw('Invalid userDefault data provided')
      }
    })
  })

  ifdescribe(process.platform === 'darwin')('systemPreferences.getUserDefault(key, type)', () => {
    it('returns values for known user defaults', () => {
      const locale = systemPreferences.getUserDefault('AppleLocale', 'string')
      expect(locale).to.be.a('string').that.is.not.empty('locale')

      const languages = systemPreferences.getUserDefault('AppleLanguages', 'array')
      expect(languages).to.be.an('array').that.is.not.empty('languages')
    })

    it('returns values for unknown user defaults', () => {
      expect(systemPreferences.getUserDefault('UserDefaultDoesNotExist', 'boolean')).to.equal(false)
      expect(systemPreferences.getUserDefault('UserDefaultDoesNotExist', 'integer')).to.equal(0)
      expect(systemPreferences.getUserDefault('UserDefaultDoesNotExist', 'float')).to.equal(0)
      expect(systemPreferences.getUserDefault('UserDefaultDoesNotExist', 'double')).to.equal(0)
      expect(systemPreferences.getUserDefault('UserDefaultDoesNotExist', 'string')).to.equal('')
      expect(systemPreferences.getUserDefault('UserDefaultDoesNotExist', 'url')).to.equal('')
      expect(systemPreferences.getUserDefault('UserDefaultDoesNotExist', 'badtype' as any)).to.be.undefined('user default')
      expect(systemPreferences.getUserDefault('UserDefaultDoesNotExist', 'array')).to.deep.equal([])
      expect(systemPreferences.getUserDefault('UserDefaultDoesNotExist', 'dictionary')).to.deep.equal({})
    })
  })

  ifdescribe(process.platform === 'darwin')('systemPreferences.setUserDefault(key, type, value)', () => {
    const KEY = 'SystemPreferencesTest'
    const TEST_CASES = [
      ['string', 'abc'],
      ['boolean', true],
      ['float', 2.5],
      ['double', 10.1],
      ['integer', 11],
      ['url', 'https://github.com/electron'],
      ['array', [1, 2, 3]],
      ['dictionary', { 'a': 1, 'b': 2 }]
    ]

    it('sets values', () => {
      for (const [type, value] of TEST_CASES) {
        systemPreferences.setUserDefault(KEY, type as any, value as any)
        const retrievedValue = systemPreferences.getUserDefault(KEY, type as any)
        expect(retrievedValue).to.deep.equal(value)
      }
    })

    it('throws when type and value conflict', () => {
      for (const [type, value] of TEST_CASES) {
        expect(() => {
          systemPreferences.setUserDefault(KEY, type as any, typeof value === 'string' ? {} : 'foo' as any)
        }).to.throw(`Unable to convert value to: ${type}`)
      }
    })

    it('throws when type is not valid', () => {
      expect(() => {
        systemPreferences.setUserDefault(KEY, 'abc', 'foo')
      }).to.throw('Invalid type: abc')
    })
  })

  ifdescribe(process.platform === 'darwin')('systemPreferences.getSystemColor(color)', () => {
    it('throws on invalid system colors', () => {
      const color = 'bad-color'
      expect(() => {
        systemPreferences.getSystemColor(color as any)
      }).to.throw(`Unknown system color: ${color}`)
    })
  
    it('returns a valid system color', () => {
      const colors = ['blue', 'brown', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'yellow']
      
      colors.forEach(color => {
        const sysColor = systemPreferences.getSystemColor(color as any)
        expect(sysColor).to.be.a('string')
      })
    })
  })

  ifdescribe(process.platform === 'darwin')('systemPreferences.appLevelAppearance', () => {
    it('has an appLevelAppearance property', () => {
      expect(systemPreferences).to.have.property('appLevelAppearance')

      // TODO(codebytere): remove when propertyification is complete
      expect(systemPreferences.setAppLevelAppearance).to.be.a('function')
      expect(() => { systemPreferences.getAppLevelAppearance() }).to.not.throw()
    })
  })

  ifdescribe(process.platform === 'darwin')('systemPreferences.setUserDefault(key, type, value)', () => {
    it('removes keys', () => {
      const KEY = 'SystemPreferencesTest'
      systemPreferences.setUserDefault(KEY, 'string', 'foo')
      systemPreferences.removeUserDefault(KEY)
      expect(systemPreferences.getUserDefault(KEY, 'string')).to.equal('')
    })

    it('does not throw for missing keys', () => {
      systemPreferences.removeUserDefault('some-missing-key')
    })
  })

  describe('systemPreferences.isInvertedColorScheme()', () => {
    it('returns a boolean', () => {
      expect(systemPreferences.isInvertedColorScheme()).to.be.a('boolean')
    })
  })

  describe('systemPreferences.isHighContrastColorScheme()', () => {
    it('returns a boolean', () => {
      expect(systemPreferences.isHighContrastColorScheme()).to.be.a('boolean')
    })
  })

  ifdescribe(process.platform === 'darwin')('systemPreferences.canPromptTouchID()', () => {
    it('returns a boolean', () => {
      expect(systemPreferences.canPromptTouchID()).to.be.a('boolean')
    })
  })

  ifdescribe(process.platform === 'darwin')('systemPreferences.isTrustedAccessibilityClient(prompt)', () => {
    it('returns a boolean', () => {
      const trusted = systemPreferences.isTrustedAccessibilityClient(false)
      expect(trusted).to.be.a('boolean')
    })
  })

  ifdescribe(process.platform === 'darwin')('systemPreferences.getMediaAccessStatus(mediaType)', () => {
    const statuses = ['not-determined', 'granted', 'denied', 'restricted', 'unknown']
    
    it('returns an access status for a camera access request', () => {
      const cameraStatus = systemPreferences.getMediaAccessStatus('camera')
      expect(statuses).to.include(cameraStatus)
    })

    it('returns an access status for a microphone access request', () => {
      const microphoneStatus = systemPreferences.getMediaAccessStatus('microphone')
      expect(statuses).to.include(microphoneStatus)
    })
  })

  describe('systemPreferences.getAnimationSettings()', () => {
    it('returns an object with all properties', () => {
      const settings = systemPreferences.getAnimationSettings()
      expect(settings).to.be.an('object')
      expect(settings).to.have.property('shouldRenderRichAnimation').that.is.a('boolean')
      expect(settings).to.have.property('scrollAnimationsEnabledBySystem').that.is.a('boolean')
      expect(settings).to.have.property('prefersReducedMotion').that.is.a('boolean')
    })
  })
})
